package com.dbms.mentalhealth.dto.listenerApplication.request;
import lombok.Data;

@Data
public class ListenerApplicationRequestDTO {
    private String fullName;
    private String branch;
    private Integer semester;
    private String usn;
    private String reasonForApplying;
    private String phoneNumber;
}