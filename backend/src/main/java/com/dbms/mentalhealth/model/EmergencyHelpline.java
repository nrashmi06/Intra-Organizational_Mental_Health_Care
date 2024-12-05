package com.dbms.mentalhealth.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Entity
@Table(name = "emergency_helplines")
public class EmergencyHelpline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "helpline_id", nullable = false, updatable = false)
    private Integer helplineId;

    @NotBlank
    @Size(max = 100)
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @NotBlank
    @Size(max = 20)
    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @NotBlank
    @Size(max = 5,message = "Country code must be between 0 and 5 characters")
    @Column(name = "country_code", nullable = false, length = 5)
    private String countryCode;

    @NotBlank
    @Size(max = 100)
    @Column(name = "emergency_type", nullable = false, length = 100)
    private String emergencyType;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    @NotNull
    @Column(name = "priority", nullable = false)
    private Integer priority;
}