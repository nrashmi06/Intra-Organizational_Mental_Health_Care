package com.dbms.mentalhealth.security.jwt;

import com.dbms.mentalhealth.service.UserService;
import com.dbms.mentalhealth.service.impl.UserServiceImpl;
import com.dbms.mentalhealth.service.RefreshTokenService;
import com.dbms.mentalhealth.urlMapper.NotificationUrlMapping;
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
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    public AuthTokenFilter(JwtUtils jwtUtils, @Lazy UserServiceImpl userService, RefreshTokenService refreshTokenService) {
        this.jwtUtils = jwtUtils;
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
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
            CONTEXT_PATH + NotificationUrlMapping.SUBSCRIBE_NOTIFICATIONS
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        logger.debug("AuthTokenFilter called for URI: {}", request.getRequestURI());

        String requestURI = request.getRequestURI();

        // Skip JWT validation for excluded URLs
        if (EXCLUDED_URLS.contains(requestURI)) {
            logger.info("Skipping JWT validation for excluded URL: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = parseJwt(request);

        // Log the received JWT token
        logger.info("Received JWT token: {}", jwt);

        // Validate and process JWT only if it exists
        if (jwt != null) {
            try {
                if (jwtUtils.validateJwtToken(jwt)) {
                    String email = jwtUtils.getUserNameFromJwtToken(jwt);
                    String role = jwtUtils.getRoleFromJwtToken(jwt);

                    UserDetails userDetails = userService.loadUserByUsername(email);

                    // Ensure role consistency
                    if (!userDetails.getAuthorities().contains(new SimpleGrantedAuthority(role))) {
                        throw new IllegalArgumentException("Role mismatch in JWT and user details");
                    }

                    // Set authentication context
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    // Update user activity
                    userService.updateUserActivity(email);
                }
            } catch (ExpiredJwtException ex) {
                logger.warn("JWT expired: {}", ex.getMessage());

                // Extract user email and update isActive status
                String email = ex.getClaims().getSubject(); // Extract email from expired token
                userService.setUserActiveStatus(email, false); // Set isActive = false

                // Add logic to inform client about the expired token
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("JWT token is expired. Please renew your token.");
                return;
            } catch (Exception e) {
                logger.error("Error processing JWT: {}", e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid JWT token.");
                return;
            }
        }

        // Proceed with the filter chain
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        return jwtUtils.getJwtFromHeader(request);
    }
}