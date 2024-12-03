package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.enums.ProfileStatus;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findById(Integer userId);
    User findByAnonymousName(String anonymousName);
    User findByEmail(String email);
    List<User> findByIsActive(Boolean isActive);
    boolean existsByEmail(String email);
    boolean existsByAnonymousName(String anonymousName);
    List<User> findByRole(Role role);
    List<User> findByIsActiveTrue();
    List<User> findByProfileStatus(ProfileStatus status);
}
