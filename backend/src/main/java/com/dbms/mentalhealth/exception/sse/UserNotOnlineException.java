package com.dbms.mentalhealth.exception.sse;

public class UserNotOnlineException extends RuntimeException {
    public UserNotOnlineException(String message) {
        super(message);
    }
}
