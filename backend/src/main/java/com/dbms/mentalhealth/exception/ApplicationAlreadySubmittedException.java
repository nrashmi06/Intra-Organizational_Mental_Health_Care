// ApplicationAlreadySubmittedException.java
package com.dbms.mentalhealth.exception;

public class ApplicationAlreadySubmittedException extends RuntimeException {
    public ApplicationAlreadySubmittedException(String message) {
        super(message);
    }
}