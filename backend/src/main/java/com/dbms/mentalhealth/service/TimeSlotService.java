package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.TimeSlot.request.TimeSlotCreateRequestDTO;
import com.dbms.mentalhealth.dto.TimeSlot.response.TimeSlotResponseDTO;
import com.dbms.mentalhealth.model.TimeSlot;

import java.time.LocalDate;
import java.util.List;

public interface TimeSlotService {
    List<TimeSlotResponseDTO> createTimeSlots(Integer adminId, LocalDate startDate, LocalDate endDate, TimeSlotCreateRequestDTO timeSlotCreateRequestDTO);
    List<TimeSlotResponseDTO> getTimeSlotsByDateRangeAndAvailability(Integer adminId, LocalDate startDate, LocalDate endDate, Boolean isAvailable);
    void deleteTimeSlotsInDateRangeAndAvailability(Integer adminId, LocalDate startDate, LocalDate endDate, Boolean isAvailable);
    TimeSlotResponseDTO updateTimeSlot(Integer adminId, Integer timeSlotId, TimeSlotCreateRequestDTO.TimeSlotDTO timeSlotDTO);
    void deleteTimeSlot(Integer adminId, Integer timeSlotId);
}