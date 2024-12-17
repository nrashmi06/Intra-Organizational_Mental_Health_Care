package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.user.request.UserRegistrationRequestDTO;
import com.dbms.mentalhealth.dto.user.response.*;
import com.dbms.mentalhealth.enums.ProfileStatus;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.model.Appointment;
import com.dbms.mentalhealth.model.ChatMessage;
import com.dbms.mentalhealth.model.Session;
import com.dbms.mentalhealth.model.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
        dto.setSessions(sessions.stream().map(session -> {
            UserDataResponseDTO.SessionDTO sessionDTO = new UserDataResponseDTO.SessionDTO();
            sessionDTO.setSessionId(session.getSessionId());
            sessionDTO.setListenerName(session.getListener().getUser().getAnonymousName());
            sessionDTO.setChatMessages(session.getChatMessages().stream()
                    .map(ChatMessage::getMessageContent)
                    .toList());
            return sessionDTO;
        }).toList());
        dto.setAppointments(appointments.stream().map(appointment -> {
            UserDataResponseDTO.AppointmentDTO appointmentDTO = new UserDataResponseDTO.AppointmentDTO();
            appointmentDTO.setAppointmentId(appointment.getAppointmentId());
            appointmentDTO.setAdminName(appointment.getAdmin().getFullName());
            appointmentDTO.setAppointmentReason(appointment.getAppointmentReason());
            appointmentDTO.setStatus(appointment.getStatus().name());
            appointmentDTO.setDate(appointment.getTimeSlot().getDate().toString());
            appointmentDTO.setStartTime(appointment.getTimeSlot().getStartTime().toString());
            appointmentDTO.setEndTime(appointment.getTimeSlot().getEndTime().toString());
            return appointmentDTO;
        }).toList());
        return dto;
    }
}