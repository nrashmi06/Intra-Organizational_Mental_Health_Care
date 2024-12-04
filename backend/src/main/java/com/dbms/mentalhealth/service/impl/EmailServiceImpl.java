package com.dbms.mentalhealth.service.impl;
import com.dbms.mentalhealth.service.EmailService;
import com.dbms.mentalhealth.urlMapper.UserUrlMapping;
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

    public void sendBlogSubmissionReceivedEmail(String email, String blogId) {
        String subject = "Blog Submission Received";
        Context context = new Context();
        String body = templateEngine.process("userBlogReceivedTemplate", context); // Template name should match your HTML file
        sendHtmlEmail(email, subject, body);
    }
    @Override
    public void sendNewBlogSubmissionEmailToAdmin(String adminEmail, String userName, String blogTitle) {
        String subject = "New Blog Submission Alert";
        Context context = new Context();
        context.setVariable("user", userName); // Dynamically set the user's name
        context.setVariable("blog", blogTitle);
        // Dynamically set the blog title
        String body = templateEngine.process("adminBlogSubmissionToReviewTemplate.html", context); // Load the template
        sendHtmlEmail(adminEmail, subject, body); // Send the email
    }
    public void sendBlogAcceptanceEmail(String email, String blogTitle) {
        String subject = "Your Blog is Now Live!";
        Context context = new Context();
        context.setVariable("blogTitle", blogTitle);
        String body = templateEngine.process("userBlogAcceptanceTemplate.html", context);
        sendHtmlEmail(email, subject, body);
    }
    @Override
    public void sendListenerApplicationReceivedEmail(String email) {
        String subject = "Listener Application Received";
        Context context = new Context();
        String body = templateEngine.process("userListenerApplicationReceivedTemplate.html", context);
        sendHtmlEmail(email, subject, body);
    }

    @Override
    public void sendNewListenerApplicationAlertToAdmin(String adminEmail, String applicationId) {
        String subject = "New Listener Application Alert";
        Context context = new Context();
        context.setVariable("applicationID", applicationId);
        String body = templateEngine.process("adminListenerApplicationAlertTemplate.html", context);
        sendHtmlEmail(adminEmail, subject, body);
    }
    public void sendBlogRejectionEmail(String email, String blogTitle) {
        String subject = "Blog Submission Update";
        Context context = new Context();
        context.setVariable("blogTitle", blogTitle);
        String body = templateEngine.process("userBlogRejectionTemplate.html", context);
        sendHtmlEmail(email, subject, body);
    }
    public void sendListenerAcceptanceEmail(String email) {
        String subject = "Listener Application Approved";
        Context context = new Context();
        String body = templateEngine.process("userListenerAcceptanceTemplate.html", context);
        sendHtmlEmail(email, subject, body);
    }

    public void sendListenerRejectionEmail(String email) {
        String subject = "Listener Application Update";
        Context context = new Context();
        String body = templateEngine.process("userListenerRejectionTemplate.html", context);
        sendHtmlEmail(email, subject, body);
    }
}