package com.dbms.mentalhealth.exception;

import com.dbms.mentalhealth.exception.Image.ImageStorageException;
import com.dbms.mentalhealth.exception.admin.*;
import com.dbms.mentalhealth.exception.adminSettings.*;
import com.dbms.mentalhealth.exception.appointment.*;
import com.dbms.mentalhealth.exception.blog.*;
import com.dbms.mentalhealth.exception.emergency.*;
import com.dbms.mentalhealth.exception.listener.*;
import com.dbms.mentalhealth.exception.session.*;
import com.dbms.mentalhealth.exception.sse.*;
import com.dbms.mentalhealth.exception.timeslot.*;
import com.dbms.mentalhealth.exception.token.*;
import com.dbms.mentalhealth.exception.user.*;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingRequestCookieException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.NoHandlerFoundException;

@RestControllerAdvice
public class CustomExceptionHandler {

    // General Spring Framework Exceptions
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<String> handleNoHandlerFoundException(NoHandlerFoundException ex) {
        return createErrorResponse("Resource not found", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handleResponseStatusException(ResponseStatusException ex) {
        return createErrorResponse("An error occurred", (HttpStatus) ex.getStatusCode());
    }

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<String> handleMultipartException(MultipartException ex) {
        return createErrorResponse("Failed to parse multipart file", HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(ImageStorageException.class)
    public ResponseEntity<String> handleImageStorageException(ImageStorageException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }
    @ExceptionHandler(IncorrectResultSizeDataAccessException.class)
    public ResponseEntity<String> handleIncorrectResultSizeDataAccessException(IncorrectResultSizeDataAccessException ex) {
        return createErrorResponse("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Authentication & Authorization Exceptions
    @ExceptionHandler(JwtTokenExpiredException.class)
    public ResponseEntity<String> handleJwtTokenExpiredException(JwtTokenExpiredException ex) {
        return createErrorResponse("Session expired. Please log in again.", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<String> handleUnauthorizedException(UnauthorizedException ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDeniedException(AccessDeniedException ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    // User Related Exceptions
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException ex) {
        return createErrorResponse("User not found", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidUserCredentialsException.class)
    public ResponseEntity<String> handleInvalidUserCredentialsException(InvalidUserCredentialsException ex) {
        return createErrorResponse("Invalid email or password", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UserNotActiveException.class)
    public ResponseEntity<String> handleUserNotActiveException(UserNotActiveException ex) {
        return createErrorResponse("User is not active", HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(UserAccountSuspendedException.class)
    public ResponseEntity<String> handleUserAccountSuspendedException(UserAccountSuspendedException ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({
            EmailAlreadyInUseException.class,
            AnonymousNameAlreadyInUseException.class
    })
    public ResponseEntity<String> handleConflictExceptions(Exception ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.CONFLICT);
    }

    // Admin Related Exceptions
    @ExceptionHandler({
            AdminNotFoundException.class,
            AdminSettingsNotFoundException.class
    })
    public ResponseEntity<String> handleAdminNotFoundExceptions(Exception ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidAdminSettingsException.class)
    public ResponseEntity<String> handleInvalidAdminSettingsException(InvalidAdminSettingsException ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    // Appointment and TimeSlot Exceptions
    @ExceptionHandler({
            AppointmentNotFoundException.class,
            TimeSlotNotFoundException.class
    })
    public ResponseEntity<String> handleAppointmentNotFoundExceptions(Exception ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({
            InvalidTimeSlotException.class,
            InvalidRequestException.class
    })
    public ResponseEntity<String> handleInvalidAppointmentExceptions(Exception ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PendingAppointmentException.class)
    public ResponseEntity<String> handlePendingAppointmentException(PendingAppointmentException ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.CONFLICT);
    }

    // Listener Related Exceptions
    @ExceptionHandler({
            ListenerNotFoundException.class,
            ListenerApplicationNotFoundException.class
    })
    public ResponseEntity<String> handleListenerNotFoundExceptions(Exception ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidListenerApplicationException.class)
    public ResponseEntity<String> handleInvalidListenerApplicationException(InvalidListenerApplicationException ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    // Session Related Exceptions
    @ExceptionHandler({
            SessionNotFoundException.class,
            FeedbackNotFoundException.class,
            ReportNotFoundException.class
    })
    public ResponseEntity<String> handleSessionRelatedNotFoundExceptions(Exception ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    // Blog Related Exceptions
    @ExceptionHandler(BlogNotFoundException.class)
    public ResponseEntity<String> handleBlogNotFoundException(BlogNotFoundException ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidBlogActionException.class)
    public ResponseEntity<String> handleInvalidBlogActionException(InvalidBlogActionException ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    // Emergency Helpline Exceptions
    @ExceptionHandler(EmergencyHelplineNotFoundException.class)
    public ResponseEntity<String> handleEmergencyHelplineNotFoundException(EmergencyHelplineNotFoundException ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidEmergencyHelplineException.class)
    public ResponseEntity<String> handleInvalidEmergencyHelplineException(InvalidEmergencyHelplineException ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    // SSE Related Exceptions
    @ExceptionHandler({
            EmitterCreationException.class,
            UserActivityException.class
    })
    public ResponseEntity<String> handleSSEExceptions(Exception ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(UserNotOnlineException.class)
    public ResponseEntity<String> handleUserNotOnlineException(UserNotOnlineException ex) {
        return createErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    // Fallback Exception Handler
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception ex) {
        return createErrorResponse("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Helper method to create consistent error responses
    private ResponseEntity<String> createErrorResponse(String message, HttpStatus status) {
        return new ResponseEntity<>(message, status);
    }
}