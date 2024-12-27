package com.dbms.mentalhealth.security.jwt;

import com.dbms.mentalhealth.service.UserService;
import com.dbms.mentalhealth.service.impl.UserServiceImpl;
import com.dbms.mentalhealth.service.RefreshTokenService;
import com.dbms.mentalhealth.urlMapper.EmergencyHelplineUrlMapping;
import com.dbms.mentalhealth.urlMapper.NotificationUrlMapping;
import com.dbms.mentalhealth.urlMapper.SSEUrlMapping;
import com.dbms.mentalhealth.urlMapper.UserUrlMapping;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    public AuthTokenFilter(JwtUtils jwtUtils, @Lazy UserServiceImpl userService) {
        this.jwtUtils = jwtUtils;
        this.userService = userService;
    }

    private static final String CONTEXT_PATH = "/mental-health";
    private static final List<String> EXCLUDED_URLS = Arrays.asList(
            CONTEXT_PATH + UserUrlMapping.FORGOT_PASSWORD,
            CONTEXT_PATH + UserUrlMapping.RESET_PASSWORD,
            CONTEXT_PATH + UserUrlMapping.USER_REGISTER,
            CONTEXT_PATH + UserUrlMapping.VERIFY_EMAIL,
            CONTEXT_PATH + UserUrlMapping.RESEND_VERIFICATION_EMAIL,
            CONTEXT_PATH + UserUrlMapping.USER_LOGIN,
            CONTEXT_PATH + UserUrlMapping.RENEW_TOKEN,
            CONTEXT_PATH + NotificationUrlMapping.SUBSCRIBE_NOTIFICATIONS,
            CONTEXT_PATH + SSEUrlMapping.SSE_ONLINE_ADMINS,
            CONTEXT_PATH + SSEUrlMapping.SSE_ONLINE_USERS_COUNT_BY_ROLE,
            CONTEXT_PATH + SSEUrlMapping.SSE_ALL_ONLINE_USERS,
            CONTEXT_PATH + SSEUrlMapping.SSE_ONLINE_LISTENERS,
            CONTEXT_PATH + SSEUrlMapping.HEARTBEAT
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        logger.debug("AuthTokenFilter called for URI: {}", request.getRequestURI());

        String requestURI = request.getRequestURI();

        // Check for excluded URLs first
        if (EXCLUDED_URLS.contains(requestURI) || requestURI.contains(CONTEXT_PATH + "/chat")) {
            logger.debug("Skipping JWT validation for excluded URL: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = parseJwt(request);
            logger.debug("Received JWT token: {}", jwt);

            // Important: Don't throw exception for null JWT, let Spring Security handle it
            if (jwt != null) {
                if (jwtUtils.validateJwtToken(jwt)) {
                    String email = jwtUtils.getUserNameFromJwtToken(jwt);
                    String role = jwtUtils.getRoleFromJwtToken(jwt);

                    UserDetails userDetails = userService.loadUserByUsername(email);

                    // Ensure role consistency
                    if (!userDetails.getAuthorities().contains(new SimpleGrantedAuthority(role))) {
                        logger.error("Role mismatch for user: {}", email);
                        SecurityContextHolder.clearContext();
                    } else {
                        // Set authentication context
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);

                        // Update user activity
                        userService.updateUserActivity(email);
                        logger.debug("User authenticated: {}", email);
                    }
                } else {
                    logger.debug("Invalid JWT token");
                    SecurityContextHolder.clearContext();
                }
            } else {
                logger.debug("No JWT token found in request");
                SecurityContextHolder.clearContext();
            }

            // Always continue the filter chain
            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException ex) {
            logger.warn("JWT expired: {}", ex.getMessage());
            String email = ex.getClaims().getSubject();
            userService.setUserActiveStatus(email, false);
            SecurityContextHolder.clearContext();
            request.setAttribute("expired", true);
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            logger.error("Error processing JWT: {}", e.getMessage());
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
        }
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        logger.debug("Authorization Header: {}", headerAuth);

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }
}