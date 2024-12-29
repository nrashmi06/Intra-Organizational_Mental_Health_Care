package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.TimeSlot.request.TimeSlotCreateRequestDTO;
import com.dbms.mentalhealth.dto.TimeSlot.response.TimeSlotResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface TimeSlotService {
    List<TimeSlotResponseDTO> createTimeSlots(String idType, Integer id, LocalDate startDate, LocalDate endDate, TimeSlotCreateRequestDTO request);
    Page<TimeSlotResponseDTO> getTimeSlotsByDateRangeAndAvailability(String idType, Integer id, LocalDate startDate, LocalDate endDate, Boolean isAvailable, Pageable pageable);
    TimeSlotResponseDTO updateTimeSlot(String idType, Integer id, Integer timeSlotId, TimeSlotCreateRequestDTO.TimeSlotDTO timeSlotDTO);
    void deleteTimeSlot(String idType, Integer id, Integer timeSlotId);
    void deleteTimeSlotsInDateRangeAndAvailability(String idType, Integer id, LocalDate startDate, LocalDate endDate, Boolean isAvailable);
}