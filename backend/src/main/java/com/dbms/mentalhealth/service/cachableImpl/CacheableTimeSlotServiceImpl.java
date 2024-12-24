package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.TimeSlot.request.TimeSlotCreateRequestDTO;
import com.dbms.mentalhealth.dto.TimeSlot.response.TimeSlotResponseDTO;
import com.dbms.mentalhealth.service.TimeSlotService;
import com.dbms.mentalhealth.service.impl.TimeSlotServiceImpl;
import com.github.benmanes.caffeine.cache.Cache;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.logging.Logger;
import java.util.Objects;

@Service
@Primary
public class CacheableTimeSlotServiceImpl implements TimeSlotService {

    private final TimeSlotServiceImpl timeSlotServiceImpl;
    private final Cache<Integer, List<TimeSlotResponseDTO>> timeSlotCache;
    private static final Logger logger = Logger.getLogger(CacheableTimeSlotServiceImpl.class.getName());

    public CacheableTimeSlotServiceImpl(TimeSlotServiceImpl timeSlotServiceImpl, Cache<Integer, List<TimeSlotResponseDTO>> timeSlotCache) {
        this.timeSlotServiceImpl = timeSlotServiceImpl;
        this.timeSlotCache = timeSlotCache;
        logger.info("CacheableTimeSlotServiceImpl initialized with cache stats enabled");
    }

    @Override
    @Transactional
    public List<TimeSlotResponseDTO> createTimeSlots(Integer adminId, LocalDate startDate, LocalDate endDate, TimeSlotCreateRequestDTO timeSlotCreateRequestDTO) {
        List<TimeSlotResponseDTO> response = timeSlotServiceImpl.createTimeSlots(adminId, startDate, endDate, timeSlotCreateRequestDTO);
        timeSlotCache.invalidate(adminId);
        logger.info("Invalidated cache for admin ID: " + adminId + " after creating time slots");
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimeSlotResponseDTO> getTimeSlotsByDateRangeAndAvailability(Integer adminId, LocalDate startDate, LocalDate endDate, Boolean isAvailable) {
        int cacheKey = Objects.hash(adminId, startDate, endDate, isAvailable);
        logger.info("Cache lookup for time slots with key: " + cacheKey);

        List<TimeSlotResponseDTO> cachedTimeSlots = timeSlotCache.getIfPresent(cacheKey);
        if (cachedTimeSlots != null) {
            logger.info("Cache HIT - Returning cached time slots for key: " + cacheKey);
            return cachedTimeSlots;
        }

        logger.info("Cache MISS - Fetching time slots from database for key: " + cacheKey);
        List<TimeSlotResponseDTO> response = timeSlotServiceImpl.getTimeSlotsByDateRangeAndAvailability(adminId, startDate, endDate, isAvailable);
        timeSlotCache.put(cacheKey, response);
        logger.info("Cached time slots for key: " + cacheKey);

        return response;
    }

    @Override
    @Transactional
    public void deleteTimeSlotsInDateRangeAndAvailability(Integer adminId, LocalDate startDate, LocalDate endDate, Boolean isAvailable) {
        timeSlotServiceImpl.deleteTimeSlotsInDateRangeAndAvailability(adminId, startDate, endDate, isAvailable);
        timeSlotCache.invalidate(adminId);
        logger.info("Invalidated cache for admin ID: " + adminId + " after deleting time slots");
    }

    @Override
    @Transactional
    public TimeSlotResponseDTO updateTimeSlot(Integer adminId, Integer timeSlotId, TimeSlotCreateRequestDTO.TimeSlotDTO timeSlotDTO) {
        TimeSlotResponseDTO response = timeSlotServiceImpl.updateTimeSlot(adminId, timeSlotId, timeSlotDTO);
        timeSlotCache.invalidate(adminId);
        logger.info("Invalidated cache for admin ID: " + adminId + " after updating time slot ID: " + timeSlotId);
        return response;
    }

    @Override
    @Transactional
    public void deleteTimeSlot(Integer adminId, Integer timeSlotId) {
        timeSlotServiceImpl.deleteTimeSlot(adminId, timeSlotId);
        timeSlotCache.invalidate(adminId);
        logger.info("Invalidated cache for admin ID: " + adminId + " after deleting time slot ID: " + timeSlotId);
    }
}