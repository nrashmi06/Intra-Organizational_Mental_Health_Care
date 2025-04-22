package com.dbms.mentalhealth.dto.session.response;


import lombok.Data;

@Data
public class SessionTagCountDTO {
    private int stressCount;
    private int depressionCount;
    private int suicidalCount;
    private int breakupCount;
    private int anxietyCount;
    private int griefCount;
    private int traumaCount;
    private int relationshipIssuesCount;
    private int selfEsteemCount;
    private int otherCount;
}
