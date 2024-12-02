// ListenerApplicationSummaryResponseDTO.java
package com.dbms.mentalhealth.dto.listenerApplication.response;

import com.dbms.mentalhealth.enums.ListenerApplicationStatus;
import lombok.Data;

@Data
public class ListenerApplicationSummaryResponseDTO {
    private Integer applicationId;
    private String fullName;
    private String branch;
    private Integer semester;
    private ListenerApplicationStatus applicationStatus;
    private String certificateUrl;
}