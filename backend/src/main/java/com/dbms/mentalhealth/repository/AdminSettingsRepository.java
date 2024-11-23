package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.AdminSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminSettingsRepository extends JpaRepository<AdminSettings, Integer> {
}
