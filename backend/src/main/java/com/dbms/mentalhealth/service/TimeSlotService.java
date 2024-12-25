package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.TimeSlot.request.TimeSlotCreateRequestDTO;
import com.dbms.mentalhealth.dto.TimeSlot.response.TimeSlotResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface TimeSlotService {
    List<TimeSlotResponseDTO> createTimeSlots(String IdType, Integer id, LocalDate startDate, LocalDate endDate, TimeSlotCreateRequestDTO timeSlotCreateRequestDTO);
    List<TimeSlotResponseDTO> getTimeSlotsByDateRangeAndAvailability(String IdType, Integer id, LocalDate startDate, LocalDate endDate, Boolean isAvailable);
    void deleteTimeSlotsInDateRangeAndAvailability(String IdType, Integer id, LocalDate startDate, LocalDate endDate, Boolean isAvailable);
    TimeSlotResponseDTO updateTimeSlot(String IdType, Integer id, Integer timeSlotId, TimeSlotCreateRequestDTO.TimeSlotDTO timeSlotDTO);
    void deleteTimeSlot(String IdType, Integer id, Integer timeSlotId);
}