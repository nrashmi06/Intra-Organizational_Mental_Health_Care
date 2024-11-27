// DuplicateTimeSlotException.java
package com.dbms.mentalhealth.exception.timeslot;

public class DuplicateTimeSlotException extends RuntimeException {
    public DuplicateTimeSlotException(String message) {
        super(message);
    }
}