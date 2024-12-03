package com.dbms.mentalhealth.dto.sessionFeedback.response;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class SessionFeedbackSummaryResponseDTO {
    private BigDecimal avgRating;
    private Integer rating5;
    private Integer rating4;
    private Integer rating3;
    private Integer rating2;
    private Integer rating1;
}