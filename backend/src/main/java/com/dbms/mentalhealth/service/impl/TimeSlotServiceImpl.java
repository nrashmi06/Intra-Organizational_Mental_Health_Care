package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.TimeSlot.request.TimeSlotCreateRequestDTO;
import com.dbms.mentalhealth.dto.TimeSlot.response.TimeSlotResponseDTO;
import com.dbms.mentalhealth.exception.timeslot.DuplicateTimeSlotException;
import com.dbms.mentalhealth.exception.timeslot.InvalidTimeSlotException;
import com.dbms.mentalhealth.mapper.TimeSlotMapper;
import com.dbms.mentalhealth.model.TimeSlot;
import com.dbms.mentalhealth.repository.TimeSlotRepository;
import com.dbms.mentalhealth.service.TimeSlotService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TimeSlotServiceImpl implements TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final TimeSlotMapper timeSlotMapper;

    @Autowired
    public TimeSlotServiceImpl(TimeSlotRepository timeSlotRepository, TimeSlotMapper timeSlotMapper) {
        this.timeSlotRepository = timeSlotRepository;
        this.timeSlotMapper = timeSlotMapper;
    }

    @Override
    @Transactional
    public List<TimeSlotResponseDTO> createTimeSlots(Integer adminId, LocalDate startDate, LocalDate endDate, TimeSlotCreateRequestDTO timeSlotCreateRequestDTO) {
        List<TimeSlot> timeSlots = timeSlotMapper.toTimeSlots(adminId, startDate, endDate, timeSlotCreateRequestDTO);

        // Check for duplicate and overlapping time slots within the provided list
        for (int i = 0; i < timeSlots.size(); i++) {
            TimeSlot timeSlot = timeSlots.get(i);

            // Check for overlapping time slots within the provided list
            for (int j = i + 1; j < timeSlots.size(); j++) {
                TimeSlot otherTimeSlot = timeSlots.get(j);
                if (timeSlot.getDate().equals(otherTimeSlot.getDate()) &&
                        timeSlot.getStartTime().isBefore(otherTimeSlot.getEndTime()) &&
                        otherTimeSlot.getStartTime().isBefore(timeSlot.getEndTime())) {
                    throw new InvalidTimeSlotException("Overlapping time slots found within the provided list for date " + timeSlot.getDate());
                }
            }

            // Check for duplicate and overlapping time slots in the database for the same admin
            boolean exists = timeSlotRepository.existsByDateAndStartTimeAndEndTimeAndAdmins_AdminId(
                    timeSlot.getDate(), timeSlot.getStartTime(), timeSlot.getEndTime(), adminId);
            if (exists) {
                throw new DuplicateTimeSlotException("Duplicate time slot found for date " + timeSlot.getDate() + " and time " + timeSlot.getStartTime() + " - " + timeSlot.getEndTime());
            }

            boolean overlaps = timeSlotRepository.existsByDateAndAdmins_AdminIdAndStartTimeLessThanAndEndTimeGreaterThan(
                    timeSlot.getDate(), adminId, timeSlot.getEndTime(), timeSlot.getStartTime());
            if (overlaps) {
                throw new InvalidTimeSlotException("Overlapping time slot found for date " + timeSlot.getDate() + " and time " + timeSlot.getStartTime() + " - " + timeSlot.getEndTime());
            }
        }

        List<TimeSlot> savedTimeSlots = timeSlotRepository.saveAll(timeSlots);
        return savedTimeSlots.stream().map(timeSlotMapper::toTimeSlotResponseDTO).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimeSlotResponseDTO> getTimeSlotsByDateRangeAndAvailability(Integer adminId, LocalDate startDate, LocalDate endDate, Boolean isAvailable) {
        List<TimeSlot> timeSlots;
        if (isAvailable == null) {
            timeSlots = timeSlotRepository.findByDateBetweenAndAdmins_AdminId(startDate, endDate, adminId);
        } else {
            timeSlots = timeSlotRepository.findByDateBetweenAndAdmins_AdminIdAndIsAvailable(startDate, endDate, adminId, isAvailable);
        }
        return timeSlots.stream().map(timeSlotMapper::toTimeSlotResponseDTO).toList();
    }

    @Override
    @Transactional
    public void deleteTimeSlotsInDateRangeAndAvailability(Integer adminId, LocalDate startDate, LocalDate endDate, Boolean isAvailable) {
        List<TimeSlot> timeSlots;
        if (isAvailable == null) {
            timeSlots = timeSlotRepository.findByDateBetweenAndAdmins_AdminId(startDate, endDate, adminId);
        } else {
            timeSlots = timeSlotRepository.findByDateBetweenAndAdmins_AdminIdAndIsAvailable(startDate, endDate, adminId, isAvailable);
        }
        timeSlotRepository.deleteAll(timeSlots);
    }

    @Override
    @Transactional
    public TimeSlotResponseDTO updateTimeSlot(Integer adminId, Integer timeSlotId, TimeSlotCreateRequestDTO.TimeSlotDTO timeSlotDTO) {
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
                .orElseThrow(() -> new IllegalArgumentException("Time slot not found"));

        if (timeSlot.getAdmins().stream().noneMatch(admin -> admin.getAdminId().equals(adminId))) {
            throw new IllegalArgumentException("Admin ID mismatch");
        }

        timeSlot.setStartTime(timeSlotDTO.getStartTime());
        timeSlot.setEndTime(timeSlotDTO.getEndTime());

        // Check for overlapping time slots on the same date in the database
        boolean overlaps = timeSlotRepository.existsByDateAndAdmins_AdminIdAndStartTimeLessThanAndEndTimeGreaterThanAndTimeSlotIdNot(
                timeSlot.getDate(), adminId, timeSlot.getEndTime(), timeSlot.getStartTime(), timeSlotId);
        if (overlaps) {
            throw new IllegalArgumentException("Overlapping time slot found for date " + timeSlot.getDate() + " and time " + timeSlot.getStartTime() + " - " + timeSlot.getEndTime());
        }

        TimeSlot updatedTimeSlot = timeSlotRepository.save(timeSlot);
        return timeSlotMapper.toTimeSlotResponseDTO(updatedTimeSlot);
    }

    @Override
    @Transactional
    public void deleteTimeSlot(Integer adminId, Integer timeSlotId) {
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
                .orElseThrow(() -> new IllegalArgumentException("Time slot not found"));

        if (timeSlot.getAdmins().stream().noneMatch(admin -> admin.getAdminId().equals(adminId))) {
            throw new IllegalArgumentException("Admin ID mismatch");
        }

        timeSlotRepository.delete(timeSlot);
    }
}