package com.dbms.mentalhealth.exception.appointment;

public class InvalidRequestException extends RuntimeException {
    public InvalidRequestException(String message) {
        super(message);
    }
}