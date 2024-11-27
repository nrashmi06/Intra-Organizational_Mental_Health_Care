package com.dbms.mentalhealth.exception.adminSettings;

public class AdminSettingNotFoundException extends RuntimeException {
    public AdminSettingNotFoundException(String message) {
        super(message);
    }
}