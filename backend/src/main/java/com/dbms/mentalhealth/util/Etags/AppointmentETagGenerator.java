package com.dbms.mentalhealth.util.Etags;

import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class AppointmentETagGenerator {
    private static final String APPOINTMENT_TAG_FORMAT = "appointment-%d-%d-%s-%s-%d-%s-%s-%s-%s-%s-%s-%s-%s-%s"; // all fields
    private static final String LIST_TAG_FORMAT = "appointment-list-%d-%d"; // size-hash
    private static final String PAGE_TAG_FORMAT = "appointment-page-%d-%d-%d-%s-%d"; // pageNumber-pageSize-totalElements-sort-hash

    public String generateAppointmentETag(AppointmentResponseDTO appointment) {
        validateAppointment(appointment);

        return String.format(APPOINTMENT_TAG_FORMAT,
                appointment.getAppointmentId(),
                appointment.getUserId(),
                appointment.getUserName(),
                appointment.getAdminName(),
                appointment.getAdminId(),
                appointment.getTimeSlotDate(),
                appointment.getTimeSlotStartTime(),
                appointment.getTimeSlotEndTime(),
                appointment.getAppointmentReason(),
                appointment.getStatus(),
                appointment.getPhoneNumber(),
                appointment.getFullName(),
                appointment.getSeverityLevel(),
                Objects.hash(appointment) // Additional hash for complete object
        );
    }

    public String generateListETag(List<AppointmentSummaryResponseDTO> appointmentList) {
        if (appointmentList == null) {
            throw new IllegalArgumentException("Appointment list cannot be null");
        }

        String contentFingerprint = appointmentList.stream()
                .filter(Objects::nonNull)
                .map(this::generateAppointmentFingerprint)
                .sorted()
                .collect(Collectors.joining());

        int contentHash = Objects.hash(contentFingerprint);

        return String.format(LIST_TAG_FORMAT,
                appointmentList.size(),
                contentHash
        );
    }

    public String generatePageETag(Page<AppointmentSummaryResponseDTO> appointmentPage) {
        if (appointmentPage == null) {
            throw new IllegalArgumentException("Appointment page cannot be null");
        }

        String contentFingerprint = appointmentPage.getContent().stream()
                .filter(Objects::nonNull)
                .map(this::generateAppointmentFingerprint)
                .sorted()
                .collect(Collectors.joining());

        String sortFingerprint = appointmentPage.getSort().stream()
                .map(order -> order.getProperty() + order.getDirection())
                .collect(Collectors.joining(","));

        int contentHash = Objects.hash(contentFingerprint);

        return String.format(PAGE_TAG_FORMAT,
                appointmentPage.getNumber(),
                appointmentPage.getSize(),
                appointmentPage.getTotalElements(),
                sortFingerprint,
                contentHash
        );
    }

    private String generateAppointmentFingerprint(AppointmentSummaryResponseDTO appointment) {
        return String.format("%d-%s-%s-%s-%s-%s-%s-%s",
                appointment.getAppointmentId(),
                appointment.getAppointmentReason(),
                appointment.getUserName(),
                appointment.getAdminName(),
                appointment.getStatus(),
                appointment.getDate(),
                appointment.getStartTime(),
                appointment.getEndTime()
        );
    }

    private void validateAppointment(AppointmentResponseDTO appointment) {
        if (appointment == null) {
            throw new IllegalArgumentException("Appointment cannot be null");
        }
        if (appointment.getAppointmentId() == null) {
            throw new IllegalArgumentException("Appointment ID cannot be null");
        }
        if (appointment.getUserId() == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (appointment.getStatus() == null) {
            throw new IllegalArgumentException("Appointment status cannot be null");
        }
        if (appointment.getPhoneNumber() == null) {
            throw new IllegalArgumentException("Phone number cannot be null");
        }
        if (appointment.getSeverityLevel() == null) {
            throw new IllegalArgumentException("Severity level cannot be null");
        }
    }
}