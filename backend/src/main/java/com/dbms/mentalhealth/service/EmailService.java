package com.dbms.mentalhealth.service;

public interface EmailService {
    void sendVerificationEmail(String email, String code);
    void sendPasswordResetEmail(String email, String code);
    void sendBlogSubmissionReceivedEmail(String email, String blogId);
    void sendNewBlogSubmissionEmailToAdmin(String adminEmail, String userName, String blogTitle);
    void sendListenerApplicationReceivedEmail(String email);
    void sendNewListenerApplicationAlertToAdmin(String adminEmail, String applicationId);
    void sendBlogAcceptanceEmail(String email, String blogTitle);
    void sendBlogRejectionEmail(String email, String blogTitle);
    void sendListenerAcceptanceEmail(String email);
    void sendListenerRejectionEmail(String email);
}