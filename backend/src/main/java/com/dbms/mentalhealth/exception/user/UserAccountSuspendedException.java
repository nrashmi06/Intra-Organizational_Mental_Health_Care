
package com.dbms.mentalhealth.exception.user;

public class UserAccountSuspendedException extends RuntimeException {
    public UserAccountSuspendedException(String message) {
        super(message);
    }
}