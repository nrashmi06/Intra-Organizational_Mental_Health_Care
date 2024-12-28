package com.dbms.mentalhealth.util;

import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Generates ETags for appointment resources to support caching and conditional requests.
 * ETags are unique identifiers that change when the resource content changes.
 */
@Component
public class AppointmentETagGenerator {
    private static final String APPOINTMENT_TAG_FORMAT = "appointment-%d-%s-%s"; // appointmentId-status-phone
    private static final String LIST_TAG_FORMAT = "appointment-list-%d-%d"; // size-hash

    /**
     * Generates an ETag for a single appointment.
     * @param appointment The appointment to generate an ETag for
     * @return A unique ETag string for the appointment
     * @throws IllegalArgumentException if appointment is null or has null required fields
     */
    public String generateAppointmentETag(AppointmentResponseDTO appointment) {
        validateAppointment(appointment);

        return String.format(APPOINTMENT_TAG_FORMAT,
                appointment.getAppointmentId(),
                appointment.getStatus(),
                appointment.getPhoneNumber()
        );
    }

    /**
     * Generates an ETag for a list of appointments.
     * @param appointmentList The list of appointments to generate an ETag for
     * @return A unique ETag string for the list of appointments
     * @throws IllegalArgumentException if appointmentList is null
     */
    public String generateListETag(List<AppointmentSummaryResponseDTO> appointmentList) {
        if (appointmentList == null) {
            throw new IllegalArgumentException("Appointment list cannot be null");
        }

        String contentFingerprint = appointmentList.stream()
                .filter(Objects::nonNull)
                .map(this::generateAppointmentFingerprint)
                .sorted()
                .collect(Collectors.joining());

        // Use a more robust hashing algorithm if needed
        int contentHash = Objects.hash(contentFingerprint);

        return String.format(LIST_TAG_FORMAT,
                appointmentList.size(),
                contentHash
        );
    }

    /**
     * Generates a fingerprint string for a single appointment summary.
     */
    private String generateAppointmentFingerprint(AppointmentSummaryResponseDTO appointment) {
        return String.format("%d-%s-%s-%s-%s-%s-%s",
                appointment.getAppointmentId(),
                appointment.getUserName(),
                appointment.getAdminName(),
                appointment.getStatus(),
                appointment.getDate(),
                appointment.getStartTime(),
                appointment.getEndTime()
        );
    }

    /**
     * Validates that an appointment and its required fields are not null.
     */
    private void validateAppointment(AppointmentResponseDTO appointment) {
        if (appointment == null) {
            throw new IllegalArgumentException("Appointment cannot be null");
        }
        if (appointment.getAppointmentId() == null) {
            throw new IllegalArgumentException("Appointment ID cannot be null");
        }
        if (appointment.getStatus() == null) {
            throw new IllegalArgumentException("Appointment status cannot be null");
        }
        if (appointment.getPhoneNumber() == null) {
            throw new IllegalArgumentException("Phone number cannot be null");
        }
    }
}