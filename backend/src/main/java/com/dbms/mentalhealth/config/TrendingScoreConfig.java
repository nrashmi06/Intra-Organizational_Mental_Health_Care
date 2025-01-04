package com.dbms.mentalhealth.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "trending")
public class TrendingScoreConfig {
    private int decayHours = 72;
    private double viewWeight = 0.4;
    private double likeWeight = 0.6;
    private double decayFactor = 1.8;
    private int batchSize = 100;
}