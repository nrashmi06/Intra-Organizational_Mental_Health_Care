package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.TimeSlot.request.TimeSlotCreateRequestDTO;
import com.dbms.mentalhealth.dto.TimeSlot.response.TimeSlotResponseDTO;
import com.dbms.mentalhealth.exception.timeslot.DuplicateTimeSlotException;
import com.dbms.mentalhealth.exception.timeslot.InvalidTimeSlotException;
import com.dbms.mentalhealth.exception.timeslot.TimeSlotNotFoundException;
import com.dbms.mentalhealth.service.TimeSlotService;
import com.dbms.mentalhealth.urlMapper.TimeSlotUrlMapping;
import com.dbms.mentalhealth.util.Etags.TimeSlotETagGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@RestController
public class TimeSlotController {
    private final TimeSlotService timeSlotService;
    private final TimeSlotETagGenerator timeSlotETagGenerator;

    @Autowired
    public TimeSlotController(TimeSlotService timeSlotService, TimeSlotETagGenerator timeSlotETagGenerator) {
        this.timeSlotService = Objects.requireNonNull(timeSlotService, "timeSlotService cannot be null");
        this.timeSlotETagGenerator = Objects.requireNonNull(timeSlotETagGenerator, "timeSlotETagGenerator cannot be null");
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping(TimeSlotUrlMapping.CREATE_TIME_SLOTS_IN_DATE_RANGE)
    public ResponseEntity<List<TimeSlotResponseDTO>> createTimeSlots(
            @PathVariable("Id") Integer id,
            @RequestParam("idType") String idType,
            @RequestParam("startDate") LocalDate startDate,
            @RequestParam("endDate") LocalDate endDate,
            @RequestBody TimeSlotCreateRequestDTO timeSlotCreateRequestDTO
    ) {
        try {
            List<TimeSlotResponseDTO> response = timeSlotService.createTimeSlots(idType, id, startDate, endDate, timeSlotCreateRequestDTO);
            String eTag = timeSlotETagGenerator.generateListETag(response);
            return ResponseEntity.ok()
                    .header(HttpHeaders.ETAG, eTag)
                    .body(response);
        } catch (InvalidTimeSlotException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (DuplicateTimeSlotException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(TimeSlotUrlMapping.GET_TIME_SLOTS_BY_ADMIN_IN_DATE_RANGE)
    public ResponseEntity<Page<TimeSlotResponseDTO>> getTimeSlotsByDateRange(
            @PathVariable("Id") Integer id,
            @RequestParam("idType") String idType,
            @RequestParam("startDate") LocalDate startDate,
            @RequestParam("endDate") LocalDate endDate,
            @RequestParam(value = "isAvailable", required = false) Boolean isAvailable,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch,
            Pageable pageable
    ) {
        try {
            Page<TimeSlotResponseDTO> response = timeSlotService.getTimeSlotsByDateRangeAndAvailability(idType, id, startDate, endDate, isAvailable, pageable);
            String eTag = timeSlotETagGenerator.generatePageETag(response);
            if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
                return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                        .header(HttpHeaders.ETAG, eTag)
                        .build();
            }
            return ResponseEntity.ok()
                    .header(HttpHeaders.ETAG, eTag)
                    .body(response);
        } catch (TimeSlotNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping(TimeSlotUrlMapping.DELETE_TIME_SLOTS_IN_DATE_RANGE)
    public ResponseEntity<Void> deleteTimeSlotsInDateRange(
            @PathVariable("Id") Integer id,
            @RequestParam("idType") String idType,
            @RequestParam("startDate") LocalDate startDate,
            @RequestParam("endDate") LocalDate endDate,
            @RequestParam(value = "isAvailable", required = false) Boolean isAvailable
    ) {
        timeSlotService.deleteTimeSlotsInDateRangeAndAvailability(idType, id, startDate, endDate, isAvailable);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(TimeSlotUrlMapping.UPDATE_TIME_SLOTS_BY_ID)
    public ResponseEntity<TimeSlotResponseDTO> updateTimeSlot(
            @PathVariable("Id") Integer id,
            @RequestParam("idType") String idType,
            @PathVariable("timeSlotId") Integer timeSlotId,
            @RequestBody TimeSlotCreateRequestDTO.TimeSlotDTO timeSlotDTO
    ) {
        try {
            TimeSlotResponseDTO response = timeSlotService.updateTimeSlot(idType, id, timeSlotId, timeSlotDTO);
            return ResponseEntity.ok(response);
        } catch (TimeSlotNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (InvalidTimeSlotException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (DuplicateTimeSlotException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping(TimeSlotUrlMapping.DELETE_TIME_SLOT_BY_ID)
    public ResponseEntity<Void> deleteTimeSlot(
            @PathVariable("Id") Integer id,
            @RequestParam("idType") String idType,
            @PathVariable("timeSlotId") Integer timeSlotId
    ) {
        try {
            timeSlotService.deleteTimeSlot(idType, id, timeSlotId);
            return ResponseEntity.noContent().build();
        } catch (TimeSlotNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}