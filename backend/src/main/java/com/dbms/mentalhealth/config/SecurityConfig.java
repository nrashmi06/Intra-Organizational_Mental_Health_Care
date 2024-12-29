// SecurityConfig.java
package com.dbms.mentalhealth.config;

import com.dbms.mentalhealth.security.*;
import com.dbms.mentalhealth.security.jwt.*;
import com.dbms.mentalhealth.urlMapper.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    private final AuthEntryPointJwt unauthorizedHandler;
    private final AuthTokenFilter authTokenFilter;
    private final CustomAccessDeniedHandler accessDeniedHandler;
    private final SseAuthenticationFilter sseAuthenticationFilter;
    private final WebSocketAuthenticationFilter webSocketAuthenticationFilter;
    private final RateLimitingFilter rateLimitingFilter;
    private final CorsConfig corsConfig;

    public SecurityConfig(
            AuthEntryPointJwt unauthorizedHandler,
            AuthTokenFilter authTokenFilter,
            CustomAccessDeniedHandler accessDeniedHandler,
            SseAuthenticationFilter sseAuthenticationFilter,
            WebSocketAuthenticationFilter webSocketAuthenticationFilter,
            RateLimitingFilter rateLimitingFilter,
            CorsConfig corsConfig
    ) {
        this.unauthorizedHandler = unauthorizedHandler;
        this.authTokenFilter = authTokenFilter;
        this.accessDeniedHandler = accessDeniedHandler;
        this.sseAuthenticationFilter = sseAuthenticationFilter;
        this.webSocketAuthenticationFilter = webSocketAuthenticationFilter;
        this.rateLimitingFilter = rateLimitingFilter;
        this.corsConfig = corsConfig;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CustomAccessDeniedHandler customAccessDeniedHandler) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
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
                .addFilterBefore(corsConfig.corsFilter(), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(sseAuthenticationFilter, AuthTokenFilter.class)
                .addFilterAfter(webSocketAuthenticationFilter, AuthTokenFilter.class)
                .build();
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