package com.dbms.mentalhealth.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.*;

@Component
@Slf4j
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RateLimitingFilter extends OncePerRequestFilter {

    private final ConcurrentMap<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${rate.limit.tokens:100}")
    private int tokensPerPeriod;

    @Value("${rate.limit.minutes:1}")
    private int periodInMinutes;

    @Value("${rate.limit.cleanup.hours:1}")
    private int cleanupIntervalHours;

    private final Set<String> whitelistedPaths = Set.of(
            "/public/**",
            "/health/**",
            "/metrics/**",
            "/actuator/**",
            "/swagger-ui/**",
            "/v3/api-docs/**"
    );

    @PostConstruct
    public void init() {
        scheduler.scheduleAtFixedRate(
                this::cleanupBuckets,
                cleanupIntervalHours,
                cleanupIntervalHours,
                TimeUnit.HOURS
        );
        log.info("Rate limiting initialized: {} requests per {} minutes",
                tokensPerPeriod, periodInMinutes);
    }

    @PreDestroy
    public void destroy() {
        try {
            scheduler.shutdown();
            if (!scheduler.awaitTermination(1, TimeUnit.MINUTES)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            scheduler.shutdownNow();
        }
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        if (shouldSkipRateLimiting(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIp(request);
        Bucket bucket = buckets.computeIfAbsent(clientIp, this::createNewBucket);

        // Add rate limit headers
        response.addHeader("X-RateLimit-Limit", String.valueOf(tokensPerPeriod));
        response.addHeader("X-RateLimit-Remaining", String.valueOf(bucket.getAvailableTokens()));

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            handleRateLimitExceeded(response, clientIp);
        }
    }

    private void handleRateLimitExceeded(HttpServletResponse response, String clientIp)
            throws IOException {
        log.warn("Rate limit exceeded for IP: {}", clientIp);
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        // Calculate retry-after time in seconds
        long retryAfterSeconds = periodInMinutes * 60L;

        response.setHeader("X-RateLimit-Retry-After", String.valueOf(retryAfterSeconds));

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("status", "error");
        responseBody.put("message", "Rate limit exceeded. Please try again later.");
        responseBody.put("retryAfterSeconds", retryAfterSeconds);

        response.getWriter().write(objectMapper.writeValueAsString(responseBody));
    }

    private String getClientIp(HttpServletRequest request) {
        String[] headersToCheck = {
                "X-Forwarded-For",
                "X-Real-IP",
                "Proxy-Client-IP",
                "WL-Proxy-Client-IP",
                "HTTP_X_FORWARDED_FOR",
                "HTTP_CLIENT_IP"
        };

        String ip = null;
        for (String header : headersToCheck) {
            ip = request.getHeader(header);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                // Get first IP if multiple are present
                ip = ip.split(",")[0].trim();
                break;
            }
        }
        return ip != null ? ip : request.getRemoteAddr();
    }

    private Bucket createNewBucket(String clientIp) {
        log.debug("Creating new rate limit bucket for IP: {}", clientIp);
        Bandwidth limit = Bandwidth.classic(tokensPerPeriod,
                Refill.intervally(tokensPerPeriod, Duration.ofMinutes(periodInMinutes)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    private void cleanupBuckets() {
        try {
            long now = System.currentTimeMillis();
            long expiryMillis = TimeUnit.MINUTES.toMillis(periodInMinutes * 2);

            int beforeSize = buckets.size();
            buckets.entrySet().removeIf(entry ->
                    now - entry.getValue().getAvailableTokens() > expiryMillis);
            int afterSize = buckets.size();

            log.debug("Bucket cleanup completed. Buckets removed: {}", beforeSize - afterSize);
        } catch (Exception e) {
            log.error("Error during bucket cleanup", e);
        }
    }

    private boolean shouldSkipRateLimiting(String path) {
        return whitelistedPaths.stream()
                .anyMatch(pattern -> matchesPattern(path, pattern));
    }

    private boolean matchesPattern(String path, String pattern) {
        if (pattern.endsWith("/**")) {
            String prefix = pattern.substring(0, pattern.length() - 3);
            return path.startsWith(prefix);
        }
        return path.equals(pattern);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return false;
    }
}