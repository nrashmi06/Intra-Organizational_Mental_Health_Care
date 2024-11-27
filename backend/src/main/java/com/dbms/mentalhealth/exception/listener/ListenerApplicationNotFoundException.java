package com.dbms.mentalhealth.exception.listener;

public class ListenerApplicationNotFoundException extends RuntimeException {
    public ListenerApplicationNotFoundException(String message) {
        super(message);
    }
}