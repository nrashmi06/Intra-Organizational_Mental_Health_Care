package com.dbms.mentalhealth.service.impl;

import com.cloudinary.utils.StringUtils;
import com.dbms.mentalhealth.dto.massEmail.MassEmailRequestDTO;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.service.EmailService;
import com.dbms.mentalhealth.urlMapper.UserUrlMapping;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);
    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;
    private final UserRepository userRepository;
    private final String baseUrl;
    private final String contextPath;

    @Autowired
    public EmailServiceImpl(JavaMailSender javaMailSender, TemplateEngine templateEngine, UserRepository userRepository, @Value("${spring.app.base-url}") String baseUrl, @Value("${context.path}") String contextPath) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
        this.userRepository = userRepository;
        this.baseUrl = baseUrl;
        this.contextPath = contextPath;
    }

    @Override
    public void sendVerificationEmail(String email, String code) {
        logger.info("Starting to send verification email to: {}", email);
        String subject = "Verify your email address";
        String verificationUrl = baseUrl + contextPath + UserUrlMapping.VERIFY_EMAIL + "?token=" + code;
        Context context = new Context();
        context.setVariable("verificationUrl", verificationUrl);
        String body = templateEngine.process("verificationEmailTemplate", context);
        sendHtmlEmail(email, subject, body);
        logger.info("Verification email sent to: {}", email);
    }

    @Override
    public void sendPasswordResetEmail(String email, String code) {
        logger.info("Starting to send password reset email to: {}", email);
        String subject = "Reset your password";
        Context context = new Context();
        context.setVariable("code", code);
        String body = templateEngine.process("passwordResetEmailTemplate", context);
        sendHtmlEmail(email, subject, body);
        logger.info("Password reset email sent to: {}", email);
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

    @Async
    @Override
    public CompletableFuture<Void> sendMassEmail(String recipientType, MassEmailRequestDTO request, List<File> files, Runnable callback) {
        if (request == null || StringUtils.isBlank(recipientType)) {
            logger.error("Invalid request: recipientType or email request is null");
            return CompletableFuture.completedFuture(null);
        }

        try {
            List<User> recipients = fetchRecipientsByType(recipientType);

            // Send email to each recipient
            recipients.forEach(recipient ->
                    sendEmailSafely(recipient.getEmail(), request.getSubject(), request.getBody(), files)
            );

        } catch (IllegalArgumentException e) {
            logger.error("Error fetching recipients: {}", e.getMessage());
        } finally {
            callback.run();
        }

        return CompletableFuture.completedFuture(null);
    }

    private List<User> fetchRecipientsByType(String recipientType) {
        logger.info("Fetching recipients for type: {}", recipientType);

        return switch (recipientType.trim().toLowerCase()) {
            case "all" -> userRepository.findAll();
            case "listener" -> userRepository.findByRole(Role.LISTENER);
            case "user" -> userRepository.findByRole(Role.USER);
            case "admin" -> userRepository.findByRole(Role.ADMIN);
            default -> throw new IllegalArgumentException("Invalid recipient type: " + recipientType);
        };
    }

    private void sendEmailSafely(String email, String subject, String body, List<File> files) {
        try {
            sendHtmlEmailWithAttachments(email, subject, body, files);
        } catch (Exception e) {
            logger.error("Failed to send email to: {}", email, e);
        }
    }

    private void sendHtmlEmailWithAttachments(String to, String subject, String body, List<File> files)
            throws MessagingException, IOException {

        if (StringUtils.isBlank(to) || StringUtils.isBlank(subject) || StringUtils.isBlank(body)) {
            logger.warn("Email parameters are invalid. To: {}, Subject: {}, Body: [empty]", to, subject);
            return;
        }

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true);

        attachFiles(helper, files);

        javaMailSender.send(message);
        logger.info("Email successfully sent to: {}", to);
    }

    private void attachFiles(MimeMessageHelper helper, List<File> files) throws MessagingException {
        if (files == null || files.isEmpty()) {
            logger.info("No files to attach.");
            return;
        }

        for (File file : files) {
            logger.info("Attaching file: {} with size: {} bytes", file.getName(), file.length());
            try {
                helper.addAttachment(file.getName(), new FileSystemResource(file));
            } catch (Exception e) {
                logger.error("Failed to attach file: {}", file.getName(), e);
            }
        }
    }

    @Override
    public void sendDataRequestVerificationEmail(String email, String token) {
        logger.info("Starting to send data request verification email to: {}", email);
        String subject = "Data Request Verification Code";
        Context context = new Context();
        context.setVariable("token", token);
        String body = templateEngine.process("dataRequestVerificationEmailTemplate.html", context);
        sendHtmlEmail(email, subject, body);
        logger.info("Data request verification email sent to: {}", email);
    }

    @Async
    @Override
    public CompletableFuture<Void> sendAppointmentRequestedEmail(String userEmail, String adminEmail, LocalDateTime appointmentTime) {
        logger.info("Starting to send appointment requested emails to user: {} and admin: {}", userEmail, adminEmail);

        // Send email to user
        String userSubject = "Appointment Request Received";
        Context userContext = new Context();
        userContext.setVariable("appointmentTime", appointmentTime);
        String userBody = templateEngine.process("userAppointmentRequestedTemplate.html", userContext);
        sendHtmlEmail(userEmail, userSubject, userBody);

        // Send email to admin
        String adminSubject = "New Appointment Request";
        Context adminContext = new Context();
        adminContext.setVariable("appointmentTime", appointmentTime);
        adminContext.setVariable("userEmail", userEmail);
        String adminBody = templateEngine.process("adminAppointmentRequestedTemplate.html", adminContext);
        sendHtmlEmail(adminEmail, adminSubject, adminBody);

        logger.info("Appointment requested emails sent to user and admin");
        return CompletableFuture.completedFuture(null);
    }

    @Async
    @Override
    public CompletableFuture<Void> sendAppointmentConfirmedEmail(String userEmail, LocalDateTime appointmentTime) {
        logger.info("Starting to send appointment confirmation email to: {}", userEmail);
        String subject = "Appointment Confirmed";
        Context context = new Context();
        context.setVariable("appointmentTime", appointmentTime);
        String body = templateEngine.process("appointmentConfirmedTemplate.html", context);
        sendHtmlEmail(userEmail, subject, body);
        logger.info("Appointment confirmation email sent to: {}", userEmail);
        return CompletableFuture.completedFuture(null);
    }

    @Async
    @Override
    public CompletableFuture<Void> sendAppointmentCancelledEmail(String userEmail, LocalDateTime appointmentTime, String cancellationReason) {
        logger.info("Starting to send appointment cancellation email to: {}", userEmail);
        String subject = "Appointment Cancelled";
        Context context = new Context();
        context.setVariable("appointmentTime", appointmentTime);
        context.setVariable("cancellationReason", cancellationReason);
        String body = templateEngine.process("appointmentCancelledTemplate.html", context);
        sendHtmlEmail(userEmail, subject, body);
        logger.info("Appointment cancellation email sent to: {}", userEmail);
        return CompletableFuture.completedFuture(null);
    }
}