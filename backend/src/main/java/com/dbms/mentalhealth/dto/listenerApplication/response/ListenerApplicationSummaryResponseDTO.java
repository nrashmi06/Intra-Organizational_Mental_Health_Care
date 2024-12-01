// ListenerApplicationSummaryResponseDTO.java
package com.dbms.mentalhealth.dto.listenerApplication.response;

import lombok.Data;

@Data
public class ListenerApplicationSummaryResponseDTO {
    private Integer applicationId;
    private String fullName;
    private String branch;
    private Integer semester;
    private String certificateUrl;
}