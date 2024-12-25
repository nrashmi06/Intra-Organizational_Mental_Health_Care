package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.TimeSlot.request.TimeSlotCreateRequestDTO;
import com.dbms.mentalhealth.dto.TimeSlot.response.TimeSlotResponseDTO;
import com.dbms.mentalhealth.exception.admin.AdminNotFoundException;
import com.dbms.mentalhealth.exception.appointment.InvalidRequestException;
import com.dbms.mentalhealth.exception.timeslot.InvalidTimeSlotException;
import com.dbms.mentalhealth.exception.timeslot.TimeSlotNotFoundException;
import com.dbms.mentalhealth.mapper.TimeSlotMapper;
import com.dbms.mentalhealth.model.Admin;
import com.dbms.mentalhealth.model.TimeSlot;
import com.dbms.mentalhealth.repository.AdminRepository;
import com.dbms.mentalhealth.repository.TimeSlotRepository;
import com.dbms.mentalhealth.service.TimeSlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TimeSlotServiceImpl implements TimeSlotService {
    private static final Logger logger = LoggerFactory.getLogger(TimeSlotServiceImpl.class);

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
        logger.debug("Fetching admin with {}: {}", idType, id);
        Admin admin;
        if ("userId".equalsIgnoreCase(idType)) {
            admin = adminRepository.findAdminByUser_UserId(id)
                    .orElseThrow(() -> new AdminNotFoundException("Admin not found for user ID: " + id));
        } else if ("adminId".equalsIgnoreCase(idType)) {
            admin = adminRepository.findById(id)
                    .orElseThrow(() -> new AdminNotFoundException("Admin not found with ID: " + id));
        } else {
            throw new InvalidRequestException("Invalid ID type: " + idType);
        }
        logger.debug("Admin found: {}", admin);
        return admin;
    }

    private void validateTimeSlot(TimeSlot timeSlot) {
        logger.debug("Validating time slot: {}", timeSlot);
        if (timeSlot.getStartTime().isAfter(timeSlot.getEndTime())) {
            throw new InvalidTimeSlotException("Start time must be before end time");
        }
    }

    private void checkForConflicts(TimeSlot timeSlot, Integer adminId, Integer excludeTimeSlotId) {
        logger.debug("Checking for conflicts for time slot: {}", timeSlot);
        List<TimeSlot> existingSlots = timeSlotRepository.findByDateAndAdmin_AdminId(timeSlot.getDate(), adminId);

        for (TimeSlot existingSlot : existingSlots) {
            if (excludeTimeSlotId != null && existingSlot.getTimeSlotId().equals(excludeTimeSlotId)) {
                continue; // Skip the time slot being updated
            }

            boolean isOverlapping = timeSlot.getStartTime().isBefore(existingSlot.getEndTime()) &&
                    timeSlot.getEndTime().isAfter(existingSlot.getStartTime());

            if (isOverlapping) {
                throw new InvalidTimeSlotException("Overlapping time slot found on date " + timeSlot.getDate() +
                        " with start time " + existingSlot.getStartTime() + " and end time " + existingSlot.getEndTime());
            }
        }
    }

    private void checkForBatchConflicts(List<TimeSlot> timeSlots, Integer adminId) {
        logger.debug("Checking for batch conflicts for time slots: {}", timeSlots);
        for (TimeSlot timeSlot : timeSlots) {
            validateTimeSlot(timeSlot);
            checkForConflicts(timeSlot, adminId, null);
        }
    }

    @Override
    public List<TimeSlotResponseDTO> createTimeSlots(String idType, Integer id, LocalDate startDate,
                                                     LocalDate endDate, TimeSlotCreateRequestDTO request) {
        logger.info("Creating time slots for admin with {}: {}, from {} to {}", idType, id, startDate, endDate);
        Admin admin = getAdmin(idType, id);

        if (startDate.isAfter(endDate)) {
            throw new InvalidTimeSlotException("Start date must be before or equal to end date");
        }

        List<TimeSlot> timeSlots = timeSlotMapper.toTimeSlots(admin.getAdminId(), startDate, endDate, request);
        checkForBatchConflicts(timeSlots, admin.getAdminId());

        List<TimeSlot> savedSlots = new ArrayList<>();
        for (TimeSlot timeSlot : timeSlots) {
            Optional<TimeSlot> existingSlot = timeSlotRepository.findByDateAndStartTimeAndEndTimeAndAdmin_AdminId(
                    timeSlot.getDate(), timeSlot.getStartTime(), timeSlot.getEndTime(), admin.getAdminId());

            if (existingSlot.isPresent()) {
                TimeSlot existing = existingSlot.get();
                existing.setStartTime(timeSlot.getStartTime());
                existing.setEndTime(timeSlot.getEndTime());
                existing.setIsAvailable(timeSlot.getIsAvailable());
                savedSlots.add(timeSlotRepository.save(existing));
            } else {
                savedSlots.add(timeSlotRepository.save(timeSlot));
            }
        }

        List<TimeSlotResponseDTO> response = savedSlots.stream()
                .map(timeSlotMapper::toTimeSlotResponseDTO)
                .toList();
        logger.info("Created time slots: {}", response);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimeSlotResponseDTO> getTimeSlotsByDateRangeAndAvailability(String idType, Integer id,
                                                                            LocalDate startDate, LocalDate endDate,
                                                                            Boolean isAvailable) {
        logger.info("Fetching time slots for admin with {}: {}, from {} to {}, availability: {}", idType, id, startDate, endDate, isAvailable);
        Admin admin = getAdmin(idType, id);
        List<TimeSlot> timeSlots = isAvailable == null ?
                timeSlotRepository.findByDateBetweenAndAdmin_AdminId(startDate, endDate, admin.getAdminId()) :
                timeSlotRepository.findByDateBetweenAndAdmin_AdminIdAndIsAvailable(startDate, endDate,
                        admin.getAdminId(), isAvailable);

        List<TimeSlotResponseDTO> response = timeSlots.stream()
                .map(timeSlotMapper::toTimeSlotResponseDTO)
                .toList();
        logger.info("Fetched time slots: {}", response);
        return response;
    }

    @Override
    public TimeSlotResponseDTO updateTimeSlot(String idType, Integer id, Integer timeSlotId,
                                              TimeSlotCreateRequestDTO.TimeSlotDTO timeSlotDTO) {
        logger.info("Updating time slot with ID: {} for admin with {}: {}", timeSlotId, idType, id);
        Admin admin = getAdmin(idType, id);
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
                .orElseThrow(() -> new TimeSlotNotFoundException("Time slot not found: " + timeSlotId));

        if (!timeSlot.getAdmin().getAdminId().equals(admin.getAdminId())) {
            throw new InvalidRequestException("Admin does not have access to this time slot");
        }

        timeSlot.setStartTime(timeSlotDTO.getStartTime());
        timeSlot.setEndTime(timeSlotDTO.getEndTime());
        validateTimeSlot(timeSlot);
        checkForConflicts(timeSlot, admin.getAdminId(), timeSlotId);

        TimeSlotResponseDTO response = timeSlotMapper.toTimeSlotResponseDTO(timeSlotRepository.save(timeSlot));
        logger.info("Updated time slot: {}", response);
        return response;
    }

    @Override
    public void deleteTimeSlot(String idType, Integer id, Integer timeSlotId) {
        logger.info("Deleting time slot with ID: {} for admin with {}: {}", timeSlotId, idType, id);
        Admin admin = getAdmin(idType, id);
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
                .orElseThrow(() -> new TimeSlotNotFoundException("Time slot not found: " + timeSlotId));

        if (!timeSlot.getAdmin().getAdminId().equals(admin.getAdminId())) {
            throw new InvalidRequestException("Admin does not have access to this time slot");
        }

        timeSlotRepository.delete(timeSlot);
        logger.info("Deleted time slot with ID: {}", timeSlotId);
    }

    @Override
    public void deleteTimeSlotsInDateRangeAndAvailability(String idType, Integer id, LocalDate startDate,
                                                          LocalDate endDate, Boolean isAvailable) {
        logger.info("Deleting time slots for admin with {}: {}, from {} to {}, availability: {}", idType, id, startDate, endDate, isAvailable);
        Admin admin = getAdmin(idType, id);
        List<TimeSlot> timeSlots = isAvailable == null ?
                timeSlotRepository.findByDateBetweenAndAdmin_AdminId(startDate, endDate, admin.getAdminId()) :
                timeSlotRepository.findByDateBetweenAndAdmin_AdminIdAndIsAvailable(startDate, endDate,
                        admin.getAdminId(), isAvailable);

        timeSlotRepository.deleteAll(timeSlots);
        logger.info("Deleted time slots for admin with {}: {}, from {} to {}, availability: {}", idType, id, startDate, endDate, isAvailable);
    }

    @Transactional(readOnly = true)
    public List<TimeSlotResponseDTO> getAllTimeSlots() {
        logger.info("Fetching all time slots");
        List<TimeSlot> timeSlots = timeSlotRepository.findAll();
        List<TimeSlotResponseDTO> response = timeSlots.stream()
                .map(timeSlotMapper::toTimeSlotResponseDTO)
                .toList();
        logger.info("Fetched all time slots: {}", response);
        return response;
    }
}