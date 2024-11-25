package com.dbms.mentalhealth.dto.EmergencyHelpline;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmergencyHelplineDTO {
    private Integer helplineId;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 20)
    private String phoneNumber;

    @NotBlank
    @Size(max = 5)
    private String countryCode;

    @NotBlank
    @Size(max = 100)
    private String emergencyType;

    @NotNull
    private Integer priority;

    @NotNull
    private Integer adminId; // New field to link to the admin who added the helpline
}