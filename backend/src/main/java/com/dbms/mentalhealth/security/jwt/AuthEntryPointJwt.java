package com.dbms.mentalhealth.security.jwt;

import com.dbms.mentalhealth.exception.token.JwtTokenExpiredException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {
    private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);
    private final ObjectMapper objectMapper;

    public AuthEntryPointJwt(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        logger.error("Unauthorized error: {}", authException.getMessage());

        if (!response.isCommitted()) {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

            final Map<String, Object> body = new HashMap<>();
            body.put("status", HttpServletResponse.SC_UNAUTHORIZED);
            body.put("error", "Unauthorized");
            body.put("path", request.getServletPath());

            if (authException.getCause() instanceof JwtTokenExpiredException ||
                    (request.getAttribute("expired") != null && (Boolean)request.getAttribute("expired"))) {
                body.put("message", "JWT token has expired. Please renew your token.");
            } else {
                String message = (String) request.getAttribute("auth_error_message");
                body.put("message", message != null ? message : authException.getMessage());
            }

            objectMapper.writeValue(response.getOutputStream(), body);
        } else {
            logger.warn("Response already committed. Unable to send error response.");
        }
    }
}