package com.dbms.mentalhealth.exception.appointment;

public class PendingAppointmentException extends RuntimeException {
    public PendingAppointmentException(String message) {
        super(message);
    }
}