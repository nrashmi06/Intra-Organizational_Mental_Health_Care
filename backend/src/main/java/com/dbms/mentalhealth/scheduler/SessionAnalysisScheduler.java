package com.dbms.mentalhealth.scheduler;

import com.dbms.mentalhealth.service.SessionAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SessionAnalysisScheduler {


    private final SessionAnalysisService sessionAnalysisService;

    @Scheduled(fixedRate = 60000)
    public void scheduleUnanalyzedSessions() {
        log.info("Scheduled task: processing unanalyzed sessions");
        sessionAnalysisService.processUnanalyzedSessions();
    }
}