package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Integer> {
    Optional<EmailVerification> findByVerificationCode(String verificationCode);
    Optional<EmailVerification> findByEmail(String email);
}