package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.Admin;
import com.dbms.mentalhealth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin,Integer> {
    Optional<Admin> findByAdminId(Integer adminId);
    Optional<Admin> findByUser(User user);
    Optional<Admin> findByUser_UserId(Integer userId);

}
