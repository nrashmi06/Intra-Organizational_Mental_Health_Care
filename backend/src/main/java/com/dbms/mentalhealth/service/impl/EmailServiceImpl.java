package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.service.EmailService;
import com.dbms.mentalhealth.urlMapper.UserUrlMapping;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.concurrent.CompletableFuture;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);
    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    @Autowired
    public EmailServiceImpl(JavaMailSender javaMailSender, TemplateEngine templateEngine) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
    }

    @Async
    @Override
    public CompletableFuture<Void> sendVerificationEmail(String email, String code) {
        logger.info("Starting to send verification email to: {}", email);
        String subject = "Verify your email address";
        String verificationUrl = "http://localhost:8080/mental-health" + UserUrlMapping.VERIFY_EMAIL + "?token=" + code;
        Context context = new Context();
        context.setVariable("verificationUrl", verificationUrl);
        String body = templateEngine.process("verificationEmailTemplate", context);
        sendHtmlEmail(email, subject, body);
        logger.info("Verification email sent to: {}", email);
        return CompletableFuture.completedFuture(null);
    }

    @Async
    @Override
    public CompletableFuture<Void> sendPasswordResetEmail(String email, String code) {
        logger.info("Starting to send password reset email to: {}", email);
        String subject = "Reset your password";
        Context context = new Context();
        context.setVariable("code", code);
        String body = templateEngine.process("passwordResetEmailTemplate", context);
        sendHtmlEmail(email, subject, body);
        logger.info("Password reset email sent to: {}", email);
        return CompletableFuture.completedFuture(null);
    }

    @Async
    @Override
    public CompletableFuture<Void> sendBlogSubmissionReceivedEmail(String email, String blogId) {
        logger.info("Starting to send blog submission received email to: {}", email);
        String subject = "Blog Submission Received";
        Context context = new Context();
        String body = templateEngine.process("userBlogReceivedTemplate", context);
        sendHtmlEmail(email, subject, body);
        logger.info("Blog submission received email sent to: {}", email);
        return CompletableFuture.completedFuture(null);
    }

    @Async
    @Override
    public CompletableFuture<Void> sendNewBlogSubmissionEmailToAdmin(String adminEmail, String userName, String blogTitle) {
        logger.info("Starting to send new blog submission email to admin: {}", adminEmail);
        String subject = "New Blog Submission Alert";
        Context context = new Context();
        context.setVariable("user", userName);
        context.setVariable("blog", blogTitle);
        String body = templateEngine.process("adminBlogSubmissionToReviewTemplate.html", context);
        sendHtmlEmail(adminEmail, subject, body);
        logger.info("New blog submission email sent to admin: {}", adminEmail);
        return CompletableFuture.completedFuture(null);
    }

    @Async
    @Override
    public CompletableFuture<Void> sendBlogAcceptanceEmail(String email, String blogTitle) {
        logger.info("Starting to send blog acceptance email to: {}", email);
        String subject = "Your Blog is Now Live!";
        Context context = new Context();
        context.setVariable("blogTitle", blogTitle);
        String body = templateEngine.process("userBlogAcceptanceTemplate.html", context);
        sendHtmlEmail(email, subject, body);
        logger.info("Blog acceptance email sent to: {}", email);
        return CompletableFuture.completedFuture(null);
    }

    @Async
    @Override
    public CompletableFuture<Void> sendBlogRejectionEmail(String email, String blogTitle) {
        logger.info("Starting to send blog rejection email to: {}", email);
        String subject = "Blog Submission Update";
        Context context = new Context();
        context.setVariable("blogTitle", blogTitle);
        String body = templateEngine.process("userBlogRejectionTemplate.html", context);
        sendHtmlEmail(email, subject, body);
        logger.info("Blog rejection email sent to: {}", email);
        return CompletableFuture.completedFuture(null);
    }

    @Async
    @Override
    public CompletableFuture<Void> sendListenerApplicationReceivedEmail(String email) {
        logger.info("Starting to send listener application received email to: {}", email);
        String subject = "Listener Application Received";
        Context context = new Context();
        String body = templateEngine.process("userListenerApplicationReceivedTemplate.html", context);
        sendHtmlEmail(email, subject, body);
        logger.info("Listener application received email sent to: {}", email);
        return CompletableFuture.completedFuture(null);
    }

    @Async
    @Override
    public CompletableFuture<Void> sendNewListenerApplicationAlertToAdmin(String adminEmail, String applicationId) {
        logger.info("Starting to send new listener application alert email to admin: {}", adminEmail);
        String subject = "New Listener Application Alert";
        Context context = new Context();
        context.setVariable("applicationID", applicationId);
        String body = templateEngine.process("adminListenerApplicationAlertTemplate.html", context);
        sendHtmlEmail(adminEmail, subject, body);
        logger.info("New listener application alert email sent to admin: {}", adminEmail);
        return CompletableFuture.completedFuture(null);
    }

    @Async
    @Override
    public CompletableFuture<Void> sendListenerAcceptanceEmail(String email) {
        logger.info("Starting to send listener acceptance email to: {}", email);
        String subject = "Listener Application Approved";
        Context context = new Context();
        String body = templateEngine.process("userListenerAcceptanceTemplate.html", context);
        sendHtmlEmail(email, subject, body);
        logger.info("Listener acceptance email sent to: {}", email);
        return CompletableFuture.completedFuture(null);
    }

    @Async
    @Override
    public CompletableFuture<Void> sendListenerRejectionEmail(String email) {
        logger.info("Starting to send listener rejection email to: {}", email);
        String subject = "Listener Application Update";
        Context context = new Context();
        String body = templateEngine.process("userListenerRejectionTemplate.html", context);
        sendHtmlEmail(email, subject, body);
        logger.info("Listener rejection email sent to: {}", email);
        return CompletableFuture.completedFuture(null);
    }

    private void sendHtmlEmail(String to, String subject, String body) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            logger.error("Failed to send email to: {}", to, e);
            throw new MailSendException("Failed to send email", e);
        }
    }
}