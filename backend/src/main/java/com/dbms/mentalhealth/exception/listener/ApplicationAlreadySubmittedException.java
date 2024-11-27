// ApplicationAlreadySubmittedException.java
package com.dbms.mentalhealth.exception.listener;

public class ApplicationAlreadySubmittedException extends RuntimeException {
    public ApplicationAlreadySubmittedException(String message) {
        super(message);
    }
}