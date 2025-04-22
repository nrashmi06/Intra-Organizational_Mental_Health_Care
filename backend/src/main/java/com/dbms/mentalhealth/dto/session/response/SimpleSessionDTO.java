package com.dbms.mentalhealth.dto.session.response;

import com.dbms.mentalhealth.enums.SessionCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SimpleSessionDTO {
    private Integer sessionId;
    private SessionCategory sessionCategory;
    private String sessionSummary;
}