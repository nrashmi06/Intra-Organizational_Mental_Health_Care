package com.dbms.mentalhealth.exception.user;

public class AnonymousNameAlreadyInUseException extends RuntimeException {
    public AnonymousNameAlreadyInUseException(String message) {
        super(message);
    }
}