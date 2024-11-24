package com.dbms.mentalhealth.exception;

public class AdminSettingNotFoundException extends RuntimeException {
    public AdminSettingNotFoundException(String message) {
        super(message);
    }
}