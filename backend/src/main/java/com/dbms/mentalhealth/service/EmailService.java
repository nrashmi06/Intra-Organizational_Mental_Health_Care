package com.dbms.mentalhealth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        javaMailSender.send(message);
    }

    public void sendVerificationEmail(String email, String token) {
        String subject = "Verify your email address";
        String body = "Click the link below to verify your email address:\n"
                + "http://localhost:8080/api/auth/verify-email?token=" + token;
        sendEmail(email, subject, body);
    }
}
