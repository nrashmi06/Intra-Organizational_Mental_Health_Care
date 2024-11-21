package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.EmergencyHelpline;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmergencyHelplineRepository extends JpaRepository<EmergencyHelpline, Integer> {
    Optional<EmergencyHelpline> findByPhoneNumber(String phoneNumber);
}