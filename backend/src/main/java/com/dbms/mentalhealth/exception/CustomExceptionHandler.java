package com.dbms.mentalhealth.exception;

import com.dbms.mentalhealth.exception.admin.AdminNotFoundException;
import com.dbms.mentalhealth.exception.adminSettings.AdminSettingsNotFoundException;
import com.dbms.mentalhealth.exception.adminSettings.InvalidAdminSettingsException;
import com.dbms.mentalhealth.exception.appointment.AppointmentNotFoundException;
import com.dbms.mentalhealth.exception.blog.BlogNotFoundException;
import com.dbms.mentalhealth.exception.blog.InvalidBlogActionException;
import com.dbms.mentalhealth.exception.emergency.EmergencyHelplineNotFoundException;
import com.dbms.mentalhealth.exception.emergency.InvalidEmergencyHelplineException;
import com.dbms.mentalhealth.exception.listener.InvalidListenerApplicationException;
import com.dbms.mentalhealth.exception.listener.ListenerApplicationNotFoundException;
import com.dbms.mentalhealth.exception.listener.ListenerNotFoundException;
import com.dbms.mentalhealth.exception.sse.EmitterCreationException;
import com.dbms.mentalhealth.exception.sse.UserNotOnlineException;
import com.dbms.mentalhealth.exception.timeslot.InvalidTimeSlotException;
import com.dbms.mentalhealth.exception.timeslot.TimeSlotNotFoundException;
import com.dbms.mentalhealth.exception.token.JwtTokenExpiredException;
import com.dbms.mentalhealth.exception.user.*;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingRequestCookieException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.multipart.MultipartException;

@RestControllerAdvice
public class CustomExceptionHandler {

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Object> handleNoHandlerFoundException(NoHandlerFoundException ex, WebRequest request) {
        return new ResponseEntity<>("Resource not found", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handleResponseStatusException(ResponseStatusException ex, WebRequest request) {
        return new ResponseEntity<>("An error occurred", ex.getStatusCode());
    }

    @ExceptionHandler(IncorrectResultSizeDataAccessException.class)
    public ResponseEntity<Object> handleIncorrectResultSizeDataAccessException(IncorrectResultSizeDataAccessException ex, WebRequest request) {
        return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(JwtTokenExpiredException.class)
    public ResponseEntity<Object> handleJwtTokenExpiredException(JwtTokenExpiredException ex, WebRequest request) {
        return new ResponseEntity<>("Session expired. Please log in again.", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<Object> handleMultipartException(MultipartException ex, WebRequest request) {
        return new ResponseEntity<>("Failed to parse multipart file", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AdminSettingsNotFoundException.class)
    public ResponseEntity<Object> handleAdminSettingsNotFoundException(AdminSettingsNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>("Admin settings not found", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AdminNotFoundException.class)
    public ResponseEntity<Object> handleAdminNotFoundException(AdminNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>("Admin not found", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Object> handleUserNotFoundException(UserNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidUserCredentialsException.class)
    public ResponseEntity<Object> handleInvalidUserCredentialsException(InvalidUserCredentialsException ex, WebRequest request) {
        return new ResponseEntity<>("Invalid email or password", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UserNotActiveException.class)
    public ResponseEntity<Object> handleUserNotActiveException(UserNotActiveException ex, WebRequest request) {
        return new ResponseEntity<>("User is not active", HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AppointmentNotFoundException.class)
    public ResponseEntity<Object> handleAppointmentNotFoundException(AppointmentNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TimeSlotNotFoundException.class)
    public ResponseEntity<Object> handleTimeSlotNotFoundException(TimeSlotNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidTimeSlotException.class)
    public ResponseEntity<Object> handleInvalidTimeSlotException(InvalidTimeSlotException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleException(Exception ex, WebRequest request) {
        return new ResponseEntity<>("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ListenerApplicationNotFoundException.class)
    public ResponseEntity<Object> handleListenerApplicationNotFoundException(ListenerApplicationNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidListenerApplicationException.class)
    public ResponseEntity<Object> handleInvalidListenerApplicationException(InvalidListenerApplicationException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(UserActivityException.class)
    public ResponseEntity<String> handleUserActivityException(UserActivityException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }

    @ExceptionHandler(EmitterCreationException.class)
    public ResponseEntity<String> handleEmitterCreationException(EmitterCreationException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidUserUpdateException.class)
    public ResponseEntity<Object> handleInvalidUserUpdateException(InvalidUserUpdateException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EmergencyHelplineNotFoundException.class)
    public ResponseEntity<Object> handleEmergencyHelplineNotFoundException(EmergencyHelplineNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidEmergencyHelplineException.class)
    public ResponseEntity<Object> handleInvalidEmergencyHelplineException(InvalidEmergencyHelplineException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BlogNotFoundException.class)
    public ResponseEntity<Object> handleBlogNotFoundException(BlogNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidBlogActionException.class)
    public ResponseEntity<Object> handleInvalidBlogActionException(InvalidBlogActionException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidAdminSettingsException.class)
    public ResponseEntity<Object> handleInvalidAdminSettingsException(InvalidAdminSettingsException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MissingRequestCookieException.class)
    public ResponseEntity<String> handleMissingRequestCookieException(MissingRequestCookieException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Required cookie 'refreshToken' is not present");
    }

    @ExceptionHandler(ListenerNotFoundException.class)
    public ResponseEntity<Object> handleListenerNotFoundException(ListenerNotFoundException ex, WebRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Listener not found");
    }

    @ExceptionHandler(EmailAlreadyVerifiedException.class)
    public ResponseEntity<Object> handleEmailAlreadyVerifiedException(EmailAlreadyVerifiedException ex, WebRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(UserNotOnlineException.class)
    public ResponseEntity<Object> handleUserNotOnlineException(UserNotOnlineException ex, WebRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}