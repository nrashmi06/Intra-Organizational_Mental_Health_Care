package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.massEmail.MassEmailRequestDTO;

import java.io.File;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface EmailService {
    void sendVerificationEmail(String email, String code);
    void sendPasswordResetEmail(String email, String code);
    CompletableFuture<Void> sendBlogSubmissionReceivedEmail(String email, String blogId);
    CompletableFuture<Void> sendNewBlogSubmissionEmailToAdmin(String adminEmail, String userName, String blogTitle);
    CompletableFuture<Void> sendBlogAcceptanceEmail(String email, String blogTitle);
    CompletableFuture<Void> sendBlogRejectionEmail(String email, String blogTitle);
    CompletableFuture<Void> sendListenerApplicationReceivedEmail(String email);
    CompletableFuture<Void> sendNewListenerApplicationAlertToAdmin(String adminEmail, String applicationId);
    CompletableFuture<Void> sendListenerAcceptanceEmail(String email);
    CompletableFuture<Void> sendListenerRejectionEmail(String email);
    CompletableFuture<Void> sendMassEmail(String recipientType, MassEmailRequestDTO request, List<File> files, Runnable callback) throws Exception;
    void sendDataRequestVerificationEmail(String email, String token);
}