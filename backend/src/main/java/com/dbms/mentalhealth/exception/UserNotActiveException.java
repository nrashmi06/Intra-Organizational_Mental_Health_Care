package com.dbms.mentalhealth.exception;

public class UserNotActiveException extends RuntimeException {
    public UserNotActiveException(String message) {
        super(message);
    }
}