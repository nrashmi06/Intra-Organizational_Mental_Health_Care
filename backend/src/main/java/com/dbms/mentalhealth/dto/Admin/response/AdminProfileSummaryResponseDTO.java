package com.dbms.mentalhealth.dto.Admin.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminProfileSummaryResponseDTO {
    private Integer adminId;
    private String fullName;
    private String adminNotes;
    private String contactNumber;
}