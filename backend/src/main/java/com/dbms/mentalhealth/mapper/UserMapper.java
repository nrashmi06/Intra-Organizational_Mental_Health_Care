package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.user.request.UserRegistrationRequestDTO;
import com.dbms.mentalhealth.dto.user.response.*;
import com.dbms.mentalhealth.enums.ProfileStatus;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.model.*;
import org.springframework.stereotype.Component;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@Component
public class UserMapper {

    public static User toEntity(UserRegistrationRequestDTO dto, String encodedPassword) {
        User user = new User();
        user.setAnonymousName(dto.getAnonymousName());
        user.setPassword(encodedPassword);
        user.setRole(Role.USER);
        user.setEmail(dto.getEmail());
        user.setIsActive(false);
        user.setProfileStatus(ProfileStatus.INACTIVE);
        return user;
    }

    public static UserRegistrationResponseDTO toRegistrationResponseDTO(User user) {
        return new UserRegistrationResponseDTO(
                user.getUserId(),
                user.getEmail(),
                user.getAnonymousName(),
                user.getRole()
        );
    }

    public static UserInfoResponseDTO toInfoResponseDTO(User user) {
        return new UserInfoResponseDTO(
                user.getUserId(),
                user.getEmail(),
                user.getAnonymousName(),
                user.getRole().name(),
                user.getIsActive(),
                user.getProfileStatus().name(),
                user.getCreatedAt().toString(),
                user.getLastSeen().toString(),
                user.getUpdatedAt().toString(),
                null
        );
    }

    public static UserLoginResponseDTO toUserLoginResponseDTO(User user) {
        return new UserLoginResponseDTO(
                user.getUserId(),
                user.getEmail(),
                user.getAnonymousName(),
                user.getRole().name()
        );
    }

    public static UserDetailsSummaryResponseDTO toUserDetailsSummaryResponseDTO(User user) {
        return new UserDetailsSummaryResponseDTO(
                user.getUserId(),
                user.getEmail(),
                user.getAnonymousName(),
                user.getIsActive(),
                user.getProfileStatus().name()
        );
    }


    public static UserDataResponseDTO toUserDataResponseDTO(User user, List<Session> sessions, List<Appointment> appointments) {
        UserDataResponseDTO dto = new UserDataResponseDTO();
        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setAnonymousName(user.getAnonymousName());
        dto.setProfileStatus(user.getProfileStatus().name());
        dto.setRole(user.getRole().name());
        dto.setTotalSessions(String.valueOf(sessions.size()));
        dto.setTotalAppointments(String.valueOf(appointments.size()));

        // Map sessions with enhanced chat message details
        dto.setSessions(sessions.stream().map(session -> {
            UserDataResponseDTO.SessionDTO sessionDTO = new UserDataResponseDTO.SessionDTO();
            sessionDTO.setSessionId(session.getSessionId());
            sessionDTO.setListenerName(session.getListener().getUser().getAnonymousName());
            sessionDTO.setSessionDate(session.getSessionStart().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));

            // Map chat messages with sender information
            sessionDTO.setChatMessages(session.getChatMessages().stream()
                    .sorted(Comparator.comparing(ChatMessage::getSentAt))
                    .map(message -> {
                        UserDataResponseDTO.ChatMessageDTO messageDTO = new UserDataResponseDTO.ChatMessageDTO();
                        messageDTO.setContent(message.getMessageContent());
                        messageDTO.setSender(message.getSender().getAnonymousName());
                        messageDTO.setTimestamp(message.getSentAt().format(
                                DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm:ss")
                        ));
                        return messageDTO;
                    })
                    .toList());
            return sessionDTO;
        }).toList());

        // Map appointments
        dto.setAppointments(appointments.stream().map(appointment -> {
            UserDataResponseDTO.AppointmentDTO appointmentDTO = new UserDataResponseDTO.AppointmentDTO();
            appointmentDTO.setAppointmentId(appointment.getAppointmentId());
            appointmentDTO.setAdminName(appointment.getAdmin().getFullName());
            appointmentDTO.setAppointmentReason(appointment.getAppointmentReason());
            appointmentDTO.setStatus(appointment.getStatus().name());
            appointmentDTO.setDate(appointment.getTimeSlot().getDate().format(
                    DateTimeFormatter.ofPattern("MMM dd, yyyy")
            ));
            appointmentDTO.setStartTime(appointment.getTimeSlot().getStartTime().toString());
            appointmentDTO.setEndTime(appointment.getTimeSlot().getEndTime().toString());
            return appointmentDTO;
        }).toList());

        return dto;
    }

    public static FullUserDetailsDTO toFullUserDetailsDTO(User user, UserMetrics userMetrics) {
        return new FullUserDetailsDTO(
                user.getUserId(),
                user.getEmail(),
                user.getAnonymousName(),
                user.getRole(),
                user.getIsActive(),
                user.getProfileStatus(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getLastSeen(),
                userMetrics.getTotalSessionsAttended(),
                userMetrics.getLastSessionDate(),
                userMetrics.getTotalAppointments(),
                userMetrics.getLastAppointmentDate(),
                userMetrics.getTotalMessagesSent(),
                userMetrics.getTotalBlogsPublished(),
                userMetrics.getTotalLikesReceived(),
                userMetrics.getTotalViewsReceived()
        );
    }
}