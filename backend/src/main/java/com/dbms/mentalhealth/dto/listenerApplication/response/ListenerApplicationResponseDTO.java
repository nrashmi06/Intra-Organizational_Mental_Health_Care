package com.dbms.mentalhealth.dto.listenerApplication.response;

import com.dbms.mentalhealth.enums.ListenerApplicationStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ListenerApplicationResponseDTO {
    private Integer applicationId; // Useful for frontend tracking or API interactions
    private String fullName;
    private String branch;
    private Integer semester;
    private String usn;
    private String phoneNumber;
    private String certificateUrl;
    private ListenerApplicationStatus applicationStatus;
    private String reasonForApplying;
    private LocalDateTime submissionDate;
    private String reviewedBy;
    private LocalDateTime reviewedAt;
}
