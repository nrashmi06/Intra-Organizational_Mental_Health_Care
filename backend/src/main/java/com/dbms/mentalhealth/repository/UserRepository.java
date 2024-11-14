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

    User findByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByIsActive(Boolean isActive);

    List<User> findByProfileStatus(ProfileStatus profileStatus);
}
