package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.service.EmailService;
import com.dbms.mentalhealth.urlMapper.userUrl.UserUrlMapping;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    @Autowired
    public EmailServiceImpl(JavaMailSender javaMailSender, TemplateEngine templateEngine) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
    }

    public void sendVerificationEmail(String email, String code) {
        String subject = "Verify your email address";
        String verificationUrl = "http://localhost:8080/mental-health" + UserUrlMapping.VERIFY_EMAIL + "?token=" + code;
        Context context = new Context();
        context.setVariable("verificationUrl", verificationUrl);
        String body = templateEngine.process("verificationEmailTemplate", context);
        sendHtmlEmail(email, subject, body);
    }

    public void sendPasswordResetEmail(String email, String code) {
        String subject = "Reset your password";
        Context context = new Context();
        context.setVariable("code", code); // Ensure the variable name matches the template
        String body = templateEngine.process("passwordResetEmailTemplate", context);
        sendHtmlEmail(email, subject, body);
    }

    public void sendHtmlEmail(String to, String subject, String body) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new MailSendException("Failed to send email", e);
        }
    }
}