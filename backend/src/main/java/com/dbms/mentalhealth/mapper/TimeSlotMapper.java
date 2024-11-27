package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.TimeSlot.request.TimeSlotCreateRequestDTO;
import com.dbms.mentalhealth.dto.TimeSlot.response.TimeSlotResponseDTO;
import com.dbms.mentalhealth.model.TimeSlot;
import com.dbms.mentalhealth.model.Admin;
import com.dbms.mentalhealth.exception.admin.AdminNotFoundException;
import com.dbms.mentalhealth.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class TimeSlotMapper {

    private final AdminRepository adminRepository;

    @Autowired
    public TimeSlotMapper(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public List<TimeSlot> toTimeSlots(Integer adminId, LocalDate startDate, LocalDate endDate, TimeSlotCreateRequestDTO timeSlotCreateRequestDTO) {
        List<TimeSlot> timeSlots = new ArrayList<>();
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
        Admin currentAdmin = adminRepository.findById(adminId)
                .orElseThrow(() -> new AdminNotFoundException("Admin with ID " + adminId + " not found"));
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            for (TimeSlotCreateRequestDTO.TimeSlotDTO timeSlotDTO : timeSlotCreateRequestDTO.getTimeSlots()) {
                if (timeSlotDTO.getStartTime().isAfter(timeSlotDTO.getEndTime())) {
                    throw new IllegalArgumentException("Start time cannot be after end time for time slot");
                }
                TimeSlot timeSlot = new TimeSlot();
                timeSlot.setDate(date);
                timeSlot.setStartTime(timeSlotDTO.getStartTime());
                timeSlot.setEndTime(timeSlotDTO.getEndTime());
                timeSlot.setIsAvailable(true); // by default
                timeSlot.setAdmins(List.of(currentAdmin));
                timeSlots.add(timeSlot);
            }
        }
        return timeSlots;
    }

    public TimeSlotResponseDTO toTimeSlotResponseDTO(TimeSlot timeSlot) {
        TimeSlotResponseDTO dto = new TimeSlotResponseDTO();
        dto.setTimeSlotId(timeSlot.getTimeSlotId());
        dto.setDate(timeSlot.getDate());
        dto.setStartTime(timeSlot.getStartTime());
        dto.setEndTime(timeSlot.getEndTime());
        dto.setIsAvailable(timeSlot.getIsAvailable());
        return dto;
    }
}