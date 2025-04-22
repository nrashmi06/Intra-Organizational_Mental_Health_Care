package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.enums.SessionCategory;
import com.dbms.mentalhealth.model.ChatMessage;
import com.dbms.mentalhealth.model.SessionStatus;
import com.dbms.mentalhealth.repository.ChatMessageRepository;
import com.dbms.mentalhealth.repository.SessionStatusRepository;
import com.dbms.mentalhealth.service.SessionAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionAnalysisServiceImpl implements SessionAnalysisService {

    private final SessionStatusRepository sessionStatusRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final GeminiServiceImpl geminiService;

    @Override
    public void processUnanalyzedSessions() {
        log.info("Processing unanalyzed sessions");
        List<SessionStatus> unanalyzedSessions = sessionStatusRepository.findByIsSessionStatusComputedFalse();

        log.info("Found {} unanalyzed sessions", unanalyzedSessions.size());

        for (SessionStatus sessionStatus : unanalyzedSessions) {
            analyzeSessionAsync(sessionStatus);
        }
    }

    @Override
    @Async
    public CompletableFuture<Void> analyzeSessionAsync(SessionStatus sessionStatus) {
        log.info("Analyzing session with ID: {}", sessionStatus.getSession().getSessionId());

        try {
            // Get all chat messages for this session
            List<ChatMessage> messages = chatMessageRepository.findBySession_SessionId(sessionStatus.getSession().getSessionId());

            if (messages.isEmpty()) {
                log.warn("No messages found for session with ID: {}", sessionStatus.getSession().getSessionId());
                return CompletableFuture.completedFuture(null);
            }

            // Format messages for analysis
            List<String> formattedMessages = formatMessagesForAnalysis(messages);

            // Build the prompt for Gemini using the method from GeminiService
            String prompt = geminiService.createJsonSessionAnalysisPrompt(formattedMessages);

            // Make API call to Gemini using the GeminiService
            String apiResponse = geminiService.callGeminiApi(prompt);

            // Parse the response using the GeminiService
            Map<String, String> analysisResult = geminiService.parseJsonAnalysisResponse(apiResponse);

            // Update the session status with the results
            updateSessionStatus(sessionStatus, analysisResult);

            log.info("Successfully analyzed session with ID: {}", sessionStatus.getSession().getSessionId());
        } catch (Exception e) {
            log.error("Error analyzing session with ID: {}", sessionStatus.getSession().getSessionId(), e);
        }

        return CompletableFuture.completedFuture(null);
    }

    @Override
    public List<String> formatMessagesForAnalysis(List<ChatMessage> messages) {
        return messages.stream()
                .sorted(Comparator.comparing(ChatMessage::getSentAt))
                .map(message -> {
                    String role = message.getSender().getRole().equals(Role.USER) ? "User" : "Counselor";
                    return role + ": " + message.getMessageContent();
                })
                .collect(Collectors.toList());
    }

    @Override
    public void updateSessionStatus(SessionStatus sessionStatus, Map<String, String> analysisResult) {
        try {
            // Update session with analysis results
            String categoryStr = analysisResult.getOrDefault("category", "OTHER").toUpperCase();
            SessionCategory category;
            try {
                if (geminiService.isValidCategory(categoryStr)) {
                    category = SessionCategory.valueOf(categoryStr);
                } else {
                    log.warn("Invalid category '{}' found, defaulting to OTHER", categoryStr);
                    category = SessionCategory.OTHER;
                }
            } catch (IllegalArgumentException e) {
                log.warn("Invalid category '{}' found, defaulting to OTHER", categoryStr);
                category = SessionCategory.OTHER;
            }

            sessionStatus.setCategory(category);
            sessionStatus.setSummary(analysisResult.getOrDefault("summary", "No summary available"));
            sessionStatus.setIsSessionStatusComputed(true);

            sessionStatusRepository.save(sessionStatus);

            log.info("Updated session status for ID: {}", sessionStatus.getStatusId());
        } catch (Exception e) {
            log.error("Error updating session status for ID: {}", sessionStatus.getStatusId(), e);
        }
    }
}