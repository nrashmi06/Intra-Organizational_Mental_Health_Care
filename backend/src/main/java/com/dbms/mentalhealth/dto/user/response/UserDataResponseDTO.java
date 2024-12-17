package com.dbms.mentalhealth.dto.user.response;

import lombok.Data;
import java.util.List;

@Data
public class UserDataResponseDTO {
    private Integer userId;
    private String email;
    private String anonymousName;
    private String profileStatus;
    private String role;
    private String totalSessions;
    private String totalAppointments;
    private List<SessionDTO> sessions;
    private List<AppointmentDTO> appointments;

    @Data
    public static class SessionDTO {
        private Integer sessionId;
        private String listenerName;
        private List<String> chatMessages;
    }

    @Data
    public static class AppointmentDTO {
        private Integer appointmentId;
        private String adminName;
        private String appointmentReason;
        private String status;
        private String date;
        private String startTime;
        private String endTime;
    }
}