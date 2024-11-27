package com.dbms.mentalhealth.exception.adminSettings;

public class AdminSettingAlreadyExistsException extends RuntimeException {
    public AdminSettingAlreadyExistsException(String message) {
        super(message);
    }
}
