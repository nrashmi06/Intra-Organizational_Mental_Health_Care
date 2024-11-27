package com.dbms.mentalhealth.exception.blog;

public class InvalidBlogActionException extends RuntimeException {
    public InvalidBlogActionException(String message) {
        super(message);
    }
}