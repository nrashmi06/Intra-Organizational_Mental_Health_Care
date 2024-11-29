package com.dbms.mentalhealth.security.jwt;

import com.dbms.mentalhealth.exception.token.JwtTokenExpiredException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {
    private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException)
            throws IOException, ServletException {

        // Enhanced logging with more context
        logAuthenticationFailure(request, authException);

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        Map<String, Object> errorDetails = createErrorResponse(request, authException);

        // Use ObjectMapper for consistent JSON serialization
        new ObjectMapper()
                .writerWithDefaultPrettyPrinter()
                .writeValue(response.getOutputStream(), errorDetails);
    }

    private void logAuthenticationFailure(HttpServletRequest request, AuthenticationException authException) {
        logger.error("Authentication Failed for URL: {}", request.getRequestURI());
        logger.error("Authentication Error: {}", authException.getMessage(), authException);

        // Log additional context if available
        String userAgent = request.getHeader("User-Agent");
        String ipAddress = request.getRemoteAddr();
        logger.info("User Agent: {}, IP Address: {}", userAgent, ipAddress);
    }

    private Map<String, Object> createErrorResponse(HttpServletRequest request, AuthenticationException authException) {
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now());
        errorDetails.put("status", HttpServletResponse.SC_UNAUTHORIZED);
        errorDetails.put("error", "Unauthorized Access");

        // Provide more detailed error messages
        if (authException instanceof BadCredentialsException) {
            errorDetails.put("message", "Invalid credentials");
        } else if (authException instanceof AccountExpiredException) {
            errorDetails.put("message", "Account has expired");
        } else if (authException instanceof LockedException) {
            errorDetails.put("message", "Account is locked");
        } else {
            errorDetails.put("message", authException.getMessage());
        }

        errorDetails.put("path", request.getServletPath());
        errorDetails.put("trace", Arrays.toString(authException.getStackTrace()));

        return errorDetails;
    }
}