package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.TimeSlot.request.TimeSlotCreateRequestDTO;
import com.dbms.mentalhealth.dto.TimeSlot.response.TimeSlotResponseDTO;
import com.dbms.mentalhealth.exception.admin.AdminNotFoundException;
import com.dbms.mentalhealth.exception.appointment.InvalidRequestException;
import com.dbms.mentalhealth.exception.timeslot.DuplicateTimeSlotException;
import com.dbms.mentalhealth.exception.timeslot.InvalidTimeSlotException;
import com.dbms.mentalhealth.exception.timeslot.TimeSlotNotFoundException;
import com.dbms.mentalhealth.mapper.TimeSlotMapper;
import com.dbms.mentalhealth.model.Admin;
import com.dbms.mentalhealth.model.TimeSlot;
import com.dbms.mentalhealth.repository.AdminRepository;
import com.dbms.mentalhealth.repository.TimeSlotRepository;
import com.dbms.mentalhealth.service.TimeSlotService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TimeSlotServiceImpl implements TimeSlotService {
    private final TimeSlotRepository timeSlotRepository;
    private final TimeSlotMapper timeSlotMapper;
    private final AdminRepository adminRepository;

    @Autowired
    public TimeSlotServiceImpl(TimeSlotRepository timeSlotRepository, TimeSlotMapper timeSlotMapper,
                               AdminRepository adminRepository) {
        this.timeSlotRepository = timeSlotRepository;
        this.timeSlotMapper = timeSlotMapper;
        this.adminRepository = adminRepository;
    }

    private Admin getAdmin(String idType, Integer id) {
        if ("userId".equalsIgnoreCase(idType)) {
            return adminRepository.findAdminByUser_UserId(id)
                    .orElseThrow(() -> new AdminNotFoundException("Admin not found for user ID: " + id));
        } else if ("adminId".equalsIgnoreCase(idType)) {
            return adminRepository.findById(id)
                    .orElseThrow(() -> new AdminNotFoundException("Admin not found with ID: " + id));
        }
        throw new InvalidRequestException("Invalid ID type: " + idType);
    }

    private void validateTimeSlot(TimeSlot timeSlot) {
        if (timeSlot.getStartTime().isAfter(timeSlot.getEndTime())) {
            throw new InvalidTimeSlotException("Start time must be before end time");
        }
    }

    private void checkOverlap(TimeSlot timeSlot, Integer adminId, Integer excludeTimeSlotId) {
        boolean overlaps = excludeTimeSlotId == null ?
                timeSlotRepository.existsByDateAndAdmin_AdminIdAndStartTimeLessThanAndEndTimeGreaterThan(
                        timeSlot.getDate(), adminId, timeSlot.getEndTime(), timeSlot.getStartTime()) :
                timeSlotRepository.existsByDateAndAdmin_AdminIdAndStartTimeLessThanAndEndTimeGreaterThanAndTimeSlotIdNot(
                        timeSlot.getDate(), adminId, timeSlot.getEndTime(), timeSlot.getStartTime(), excludeTimeSlotId);

        if (overlaps) {
            throw new InvalidTimeSlotException("Overlapping time slot found for date " + timeSlot.getDate());
        }
    }

    @Override
    public List<TimeSlotResponseDTO> createTimeSlots(String idType, Integer id, LocalDate startDate,
                                                     LocalDate endDate, TimeSlotCreateRequestDTO request) {
        Admin admin = getAdmin(idType, id);
        if (startDate.isAfter(endDate)) {
            throw new InvalidTimeSlotException("Start date must be before or equal to end date");
        }

        List<TimeSlot> timeSlots = timeSlotMapper.toTimeSlots(admin.getAdminId(), startDate, endDate, request);

        for (TimeSlot timeSlot : timeSlots) {
            validateTimeSlot(timeSlot);
            checkOverlap(timeSlot, admin.getAdminId(), null);

            boolean exists = timeSlotRepository.existsByDateAndStartTimeAndEndTimeAndAdmin_AdminId(
                    timeSlot.getDate(), timeSlot.getStartTime(), timeSlot.getEndTime(), admin.getAdminId());
            if (exists) {
                throw new DuplicateTimeSlotException("Duplicate time slot found for date " + timeSlot.getDate());
            }
        }

        return timeSlotRepository.saveAll(timeSlots).stream()
                .map(timeSlotMapper::toTimeSlotResponseDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimeSlotResponseDTO> getTimeSlotsByDateRangeAndAvailability(String idType, Integer id,
                                                                            LocalDate startDate, LocalDate endDate,
                                                                            Boolean isAvailable) {
        Admin admin = getAdmin(idType, id);
        List<TimeSlot> timeSlots = isAvailable == null ?
                timeSlotRepository.findByDateBetweenAndAdmin_AdminId(startDate, endDate, admin.getAdminId()) :
                timeSlotRepository.findByDateBetweenAndAdmin_AdminIdAndIsAvailable(startDate, endDate,
                        admin.getAdminId(), isAvailable);

        return timeSlots.stream()
                .map(timeSlotMapper::toTimeSlotResponseDTO)
                .toList();
    }

    @Override
    public TimeSlotResponseDTO updateTimeSlot(String idType, Integer id, Integer timeSlotId,
                                              TimeSlotCreateRequestDTO.TimeSlotDTO timeSlotDTO) {
        Admin admin = getAdmin(idType, id);
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
                .orElseThrow(() -> new TimeSlotNotFoundException("Time slot not found: " + timeSlotId));

        if (!timeSlot.getAdmin().getAdminId().equals(admin.getAdminId())) {
            throw new InvalidRequestException("Admin does not have access to this time slot");
        }

        timeSlot.setStartTime(timeSlotDTO.getStartTime());
        timeSlot.setEndTime(timeSlotDTO.getEndTime());
        validateTimeSlot(timeSlot);
        checkOverlap(timeSlot, admin.getAdminId(), timeSlotId);

        return timeSlotMapper.toTimeSlotResponseDTO(timeSlotRepository.save(timeSlot));
    }

    @Override
    public void deleteTimeSlot(String idType, Integer id, Integer timeSlotId) {
        Admin admin = getAdmin(idType, id);
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
                .orElseThrow(() -> new TimeSlotNotFoundException("Time slot not found: " + timeSlotId));

        if (!timeSlot.getAdmin().getAdminId().equals(admin.getAdminId())) {
            throw new InvalidRequestException("Admin does not have access to this time slot");
        }

        timeSlotRepository.delete(timeSlot);
    }

    @Override
    public void deleteTimeSlotsInDateRangeAndAvailability(String idType, Integer id, LocalDate startDate,
                                                          LocalDate endDate, Boolean isAvailable) {
        Admin admin = getAdmin(idType, id);
        List<TimeSlot> timeSlots = isAvailable == null ?
                timeSlotRepository.findByDateBetweenAndAdmin_AdminId(startDate, endDate, admin.getAdminId()) :
                timeSlotRepository.findByDateBetweenAndAdmin_AdminIdAndIsAvailable(startDate, endDate,
                        admin.getAdminId(), isAvailable);

        timeSlotRepository.deleteAll(timeSlots);
    }

    @Transactional(readOnly = true)
    public List<TimeSlotResponseDTO> getAllTimeSlots() {
        List<TimeSlot> timeSlots = timeSlotRepository.findAll();
        return timeSlots.stream()
                .map(timeSlotMapper::toTimeSlotResponseDTO)
                .toList();
    }
}