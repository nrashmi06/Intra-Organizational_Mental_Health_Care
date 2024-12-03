package com.dbms.mentalhealth.exception.session;

public class ReportNotFoundException extends RuntimeException {
    public ReportNotFoundException(String message) {
        super(message);
    }
}