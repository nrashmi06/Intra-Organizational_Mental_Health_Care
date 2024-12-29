package com.dbms.mentalhealth.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {
    private static final Logger logger = LoggerFactory.getLogger(CorsConfig.class);
    private final String allowedOrigins;

    public CorsConfig(@Value("${allowed.origins}") String allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
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
                "Access-Control-Request-Headers", HttpHeaders.IF_NONE_MATCH
        ));
        configuration.setExposedHeaders(Arrays.asList(
                HttpHeaders.AUTHORIZATION, HttpHeaders.CONTENT_TYPE,
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials",
                HttpHeaders.ETAG
        ));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        logger.info("Allowed Origins: {}", allowedOrigins);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}