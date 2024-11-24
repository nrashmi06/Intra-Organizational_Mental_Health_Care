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

        // Check for duplicate time slots
        for (TimeSlot timeSlot : timeSlots) {
            boolean exists = timeSlotRepository.existsByDateAndStartTimeAndEndTimeAndAdmins_AdminId(
                    timeSlot.getDate(), timeSlot.getStartTime(), timeSlot.getEndTime(), adminId);
            if (exists) {
                throw new IllegalArgumentException("Duplicate time slot found for date " + timeSlot.getDate() + " and time " + timeSlot.getStartTime() + " - " + timeSlot.getEndTime());
            }
        }

        List<TimeSlot> savedTimeSlots = timeSlotRepository.saveAll(timeSlots);
        return savedTimeSlots.stream().map(timeSlotMapper::toTimeSlotResponseDTO).toList();
    }

    @Override
    public List<TimeSlotResponseDTO> getTimeSlotsByDateRange(LocalDate startDate, LocalDate endDate) {
        List<TimeSlot> timeSlots = timeSlotRepository.findByDateBetween(startDate, endDate);
        return timeSlots.stream().map(timeSlotMapper::toTimeSlotResponseDTO).collect(Collectors.toList());
    }

}