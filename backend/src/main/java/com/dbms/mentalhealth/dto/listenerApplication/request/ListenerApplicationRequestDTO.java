package com.dbms.mentalhealth.dto.listenerApplication.request;

import com.dbms.mentalhealth.enums.ListenerApplicationStatus;
import lombok.Data;

@Data
public class ListenerApplicationRequestDTO {
    private String fullName;
    private String branch;
    private Integer semester;
    private String usn;
    private String phoneNumber;
}