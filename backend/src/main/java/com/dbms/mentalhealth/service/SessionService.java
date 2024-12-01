package com.dbms.mentalhealth.service;

public interface SessionService {
    String getActiveSessions();
    String initiateSession(Integer listenerId, String message);
    String updateSessionStatus(Integer userId, String action);
    String getSessionById(Integer sessionId);
    String getAllSessions();
    String endSession(Integer sessionId);
}