package com.dbms.mentalhealth.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModerationResult {
    private boolean allowed;
    private String reason;

    // Convenience method to quickly create an allowed result
    public static ModerationResult allowed() {
        return new ModerationResult(true, null);
    }

    // Convenience method to quickly create a rejected result with reason
    public static ModerationResult rejected(String reason) {
        return new ModerationResult(false, reason);
    }
}