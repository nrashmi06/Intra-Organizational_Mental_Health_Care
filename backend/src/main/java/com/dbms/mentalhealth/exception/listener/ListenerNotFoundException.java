package com.dbms.mentalhealth.exception.listener;

public class ListenerNotFoundException extends RuntimeException {
    public ListenerNotFoundException(String message) {
        super(message);
    }
}
