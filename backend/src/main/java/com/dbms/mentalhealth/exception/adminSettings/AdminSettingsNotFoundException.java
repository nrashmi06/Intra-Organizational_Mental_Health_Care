package com.dbms.mentalhealth.exception.adminSettings;

public class AdminSettingsNotFoundException extends RuntimeException {
    public AdminSettingsNotFoundException(String message) {
        super(message);
    }

    public AdminSettingsNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}