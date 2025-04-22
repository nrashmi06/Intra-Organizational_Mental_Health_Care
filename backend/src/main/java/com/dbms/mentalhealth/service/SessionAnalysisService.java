package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.model.ChatMessage;
import com.dbms.mentalhealth.model.SessionStatus;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

public interface SessionAnalysisService {
    /**
     * Scheduled task that runs at specified intervals to process unanalyzed sessions
     */
    void processUnanalyzedSessions();

    /**
     * Analyzes a single session asynchronously using Gemini
     * @param sessionStatus The session status to analyze
     * @return CompletableFuture for asynchronous handling
     */
    CompletableFuture<Void> analyzeSessionAsync(SessionStatus sessionStatus);

    /**
     * Formats chat messages in a readable format for analysis
     * @param messages List of chat messages to format
     * @return Formatted messages for analysis
     */
    List<String> formatMessagesForAnalysis(List<ChatMessage> messages);

    /**
     * Updates the session status with analysis results
     * @param sessionStatus The session status to update
     * @param analysisResult The analysis results from Gemini
     */
    void updateSessionStatus(SessionStatus sessionStatus, Map<String, String> analysisResult);
}