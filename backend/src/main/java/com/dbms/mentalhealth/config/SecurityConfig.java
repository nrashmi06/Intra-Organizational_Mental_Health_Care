package com.dbms.mentalhealth.config;

import com.dbms.mentalhealth.security.CustomAccessDeniedHandler;
import com.dbms.mentalhealth.security.RateLimitingFilter;
import com.dbms.mentalhealth.security.SseAuthenticationFilter;
import com.dbms.mentalhealth.security.WebSocketAuthenticationFilter;
import com.dbms.mentalhealth.security.jwt.AuthEntryPointJwt;
import com.dbms.mentalhealth.security.jwt.AuthTokenFilter;
import com.dbms.mentalhealth.urlMapper.EmergencyHelplineUrlMapping;
import com.dbms.mentalhealth.urlMapper.UserUrlMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    private final AuthEntryPointJwt unauthorizedHandler;
    private final AuthTokenFilter authTokenFilter;
    private final CustomAccessDeniedHandler accessDeniedHandler;
    private final SseAuthenticationFilter sseAuthenticationFilter;
    private final String allowedOrigins;
    private final WebSocketAuthenticationFilter webSocketAuthenticationFilter;
    private final RateLimitingFilter rateLimitingFilter;

    public SecurityConfig(
            AuthEntryPointJwt unauthorizedHandler,
            AuthTokenFilter authTokenFilter,
            CustomAccessDeniedHandler accessDeniedHandler,
            SseAuthenticationFilter sseAuthenticationFilter,
            @Value("${allowed.origins}") String allowedOrigins,
            WebSocketAuthenticationFilter webSocketAuthenticationFilter,
            RateLimitingFilter rateLimitingFilter
    ) {
        this.unauthorizedHandler = unauthorizedHandler;
        this.authTokenFilter = authTokenFilter;
        this.accessDeniedHandler = accessDeniedHandler;
        this.sseAuthenticationFilter = sseAuthenticationFilter;
        this.allowedOrigins = allowedOrigins;
        this.webSocketAuthenticationFilter = webSocketAuthenticationFilter;
        this.rateLimitingFilter = rateLimitingFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CustomAccessDeniedHandler customAccessDeniedHandler) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(requests -> requests
                                .requestMatchers(
                                        UserUrlMapping.FORGOT_PASSWORD,
                                        UserUrlMapping.RESET_PASSWORD,
                                        UserUrlMapping.USER_REGISTER,
                                        UserUrlMapping.VERIFY_EMAIL,
                                        UserUrlMapping.RESEND_VERIFICATION_EMAIL,
                                        UserUrlMapping.USER_LOGIN,
                                        UserUrlMapping.RENEW_TOKEN,
                                        EmergencyHelplineUrlMapping.GET_ALL_EMERGENCY_HELPLINES
                                ).permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(unauthorizedHandler)
                        .accessDeniedHandler(customAccessDeniedHandler)
                )
                .csrf(AbstractHttpConfigurer::disable)
                // Reorganize filters to ensure proper order
                .addFilterBefore(corsFilter(), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)
                // JWT filter should be after CORS but before authentication
                .addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class)
                // Other filters after JWT authentication is established
                .addFilterAfter(sseAuthenticationFilter, AuthTokenFilter.class)
                .addFilterAfter(webSocketAuthenticationFilter, AuthTokenFilter.class)
                .build();
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                Arrays.stream(allowedOrigins.split(","))
                        .toList()
        );

        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        configuration.setAllowedHeaders(Arrays.asList(
                HttpHeaders.AUTHORIZATION, HttpHeaders.CONTENT_TYPE, "X-Requested-With",
                "accept", HttpHeaders.ORIGIN, "Access-Control-Request-Method",
                "Access-Control-Request-Headers", HttpHeaders.IF_NONE_MATCH  // Add this
        ));
        configuration.setExposedHeaders(Arrays.asList(
                HttpHeaders.AUTHORIZATION, HttpHeaders.CONTENT_TYPE,
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials",
                HttpHeaders.ETAG
        ));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        // Log the allowed origins
        logger.info("Allowed Origins: {}", allowedOrigins);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}