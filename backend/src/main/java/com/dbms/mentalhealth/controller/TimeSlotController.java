package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.TimeSlot.request.TimeSlotCreateRequestDTO;
import com.dbms.mentalhealth.dto.TimeSlot.response.TimeSlotResponseDTO;
import com.dbms.mentalhealth.service.TimeSlotService;
import com.dbms.mentalhealth.urlMapper.TimeSlotUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
public class TimeSlotController {
    private final TimeSlotService timeSlotService;

    @Autowired
    public TimeSlotController(TimeSlotService timeSlotService) {
        this.timeSlotService = timeSlotService;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping(TimeSlotUrlMapping.CREATE_TIME_SLOTS_IN_DATE_RANGE)
    public ResponseEntity<List<TimeSlotResponseDTO>> createTimeSlots(
            @PathVariable("adminId") Integer adminId,
            @RequestParam("startDate") LocalDate startDate,
            @RequestParam("endDate") LocalDate endDate,
            @RequestBody TimeSlotCreateRequestDTO timeSlotCreateRequestDTO
    ) {
        List<TimeSlotResponseDTO> response = timeSlotService.createTimeSlots(adminId, startDate, endDate, timeSlotCreateRequestDTO);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping(TimeSlotUrlMapping.GET_TIME_SLOTS_BY_ADMIN_IN_DATE_RANGE)
    public ResponseEntity<List<TimeSlotResponseDTO>> getTimeSlotsByDateRange(
            @PathVariable("adminId") Integer adminId,
            @RequestParam("startDate") LocalDate startDate,
            @RequestParam("endDate") LocalDate endDate,
            @RequestParam(value = "isAvailable", required = false) Boolean isAvailable
    ) {
        List<TimeSlotResponseDTO> response = timeSlotService.getTimeSlotsByDateRangeAndAvailability(adminId, startDate, endDate, isAvailable);
        return ResponseEntity.ok(response);
    }


}