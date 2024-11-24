package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.TimeSlot.request.TimeSlotCreateRequestDTO;
import com.dbms.mentalhealth.dto.TimeSlot.response.TimeSlotResponseDTO;
import com.dbms.mentalhealth.mapper.TimeSlotMapper;
import com.dbms.mentalhealth.model.TimeSlot;
import com.dbms.mentalhealth.repository.TimeSlotRepository;
import com.dbms.mentalhealth.service.TimeSlotService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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
                    throw new IllegalArgumentException("Overlapping time slots found within the provided list for date " + timeSlot.getDate());
                }
            }

            // Check for duplicate and overlapping time slots in the database
            boolean exists = timeSlotRepository.existsByDateAndStartTimeAndEndTimeAndAdmins_AdminId(
                    timeSlot.getDate(), timeSlot.getStartTime(), timeSlot.getEndTime(), adminId);
            if (exists) {
                throw new IllegalArgumentException("Duplicate time slot found for date " + timeSlot.getDate() + " and time " + timeSlot.getStartTime() + " - " + timeSlot.getEndTime());
            }

            boolean overlaps = timeSlotRepository.existsByDateAndAdmins_AdminIdAndStartTimeLessThanAndEndTimeGreaterThan(
                    timeSlot.getDate(), adminId, timeSlot.getEndTime(), timeSlot.getStartTime());
            if (overlaps) {
                throw new IllegalArgumentException("Overlapping time slot found for date " + timeSlot.getDate() + " and time " + timeSlot.getStartTime() + " - " + timeSlot.getEndTime());
            }
        }

        List<TimeSlot> savedTimeSlots = timeSlotRepository.saveAll(timeSlots);
        return savedTimeSlots.stream().map(timeSlotMapper::toTimeSlotResponseDTO).toList();
    }
    @Override
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
}