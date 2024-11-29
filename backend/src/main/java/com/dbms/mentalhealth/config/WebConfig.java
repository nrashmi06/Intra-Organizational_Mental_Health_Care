package com.dbms.mentalhealth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders(
                                "Authorization",
                                "Content-Type",
                                "X-Requested-With",
                                "accept",
                                "Origin",
                                "Access-Control-Request-Method",
                                "Access-Control-Request-Headers"
                        )
                        .exposedHeaders(
                                "Authorization",
                                "Content-Type",
                                "Access-Control-Allow-Origin",
                                "Access-Control-Allow-Credentials"
                        )
                        .allowCredentials(true)
                        .maxAge(3600); // Cache preflight request for 1 hour
            }
        };
    }
}