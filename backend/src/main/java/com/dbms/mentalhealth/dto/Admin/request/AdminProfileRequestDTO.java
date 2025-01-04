package com.dbms.mentalhealth.dto.Admin.request;

import lombok.Data;
@Data
public class AdminProfileRequestDTO {
    private String adminNotes;
    private String fullName;
    private String qualifications;
    private String contactNumber;
    private String email;
}