package com.dbms.mentalhealth.scheduler;

import com.dbms.mentalhealth.model.ChatMessage;
import com.dbms.mentalhealth.service.ChatMessageService;
import com.dbms.mentalhealth.service.ListenerService;
import com.dbms.mentalhealth.service.UserMetricService;
import com.dbms.mentalhealth.service.impl.UserMetricServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;

@Slf4j
@Component
public class ChatMessageScheduler {
    private final ChatMessageService chatMessageService;
    private final ListenerService listenerService;

    private final BlockingQueue<ChatMessage> messageQueue = new LinkedBlockingQueue<>();
    private final Map<String, Integer> messageCountBuffer = new ConcurrentHashMap<>();

    private static final int BATCH_SIZE = 100;
    private final UserMetricService userMetricService;
    int batchSize = calculateDynamicBatchSize();

    public ChatMessageScheduler(ChatMessageService chatMessageService, ListenerService listenerService, UserMetricService userMetricService) {
        this.chatMessageService = chatMessageService;
        this.listenerService = listenerService;
        this.userMetricService = userMetricService;
    }

    public void queueMessage(ChatMessage message, String username) {
        messageQueue.offer(message);
        messageCountBuffer.compute(username, (k, v) -> (v == null) ? 1 : v + 1);
        log.info("Queued message from user: {}", username);
    }

    @Scheduled(fixedDelay = 30000) // 5 seconds
    public void processBatchMessages() {
        List<ChatMessage> messageBatch = new ArrayList<>();
        messageQueue.drainTo(messageBatch, batchSize);

        if (!messageBatch.isEmpty()) {
            try {
                chatMessageService.saveMessages(messageBatch);
                log.info("Successfully processed batch of {} messages", messageBatch.size());
            } catch (Exception e) {
                log.error("Error processing message batch", e);
                // Requeue failed messages
                messageBatch.forEach(messageQueue::offer);
                log.info("Requeued {} failed messages", messageBatch.size());
            }
        }
    }

    @Scheduled(fixedDelay = 60000)
    public void processMessageCounts() {
        Map<String, Integer> countsToProcess = new HashMap<>(messageCountBuffer);
        messageCountBuffer.clear();

        countsToProcess.forEach((username, count) -> {
            if (count > 0) {
                boolean listenerUpdated = false;
                boolean metricsUpdated = false;

                try {
                    listenerService.incrementMessageCount(username, count);
                    listenerUpdated = true;
                    userMetricService.incrementMessageCount(username, count);
                    metricsUpdated = true;
                    log.info("Updated message count for user {}: +{}", username, count);
                } catch (Exception e) {
                    log.error("Error updating message count for user {}", username, e);
                    // Only requeue the counts that failed to update
                    if (!listenerUpdated || !metricsUpdated) {
                        messageCountBuffer.compute(username, (k, v) -> (v == null) ? count : v + count);
                    }
                }
            }
        });
    }
    private int calculateDynamicBatchSize() {
        int queueSize = messageQueue.size();
        return Math.min(BATCH_SIZE, Math.max(10, queueSize / 10));
    }
}