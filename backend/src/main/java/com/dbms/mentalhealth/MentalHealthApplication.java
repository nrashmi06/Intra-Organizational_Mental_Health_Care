package com.dbms.mentalhealth;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
@EnableScheduling
@EnableCaching
public class MentalHealthApplication {
    public static void main(String[] args) {
        SpringApplication.run(MentalHealthApplication.class, args);
    }
}
