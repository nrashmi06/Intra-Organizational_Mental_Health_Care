package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.TimeSlot.request.TimeSlotCreateRequestDTO;
import com.dbms.mentalhealth.dto.TimeSlot.response.TimeSlotResponseDTO;
import com.dbms.mentalhealth.service.TimeSlotService;
import com.dbms.mentalhealth.service.impl.TimeSlotServiceImpl;
import com.github.benmanes.caffeine.cache.Cache;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Primary
@Slf4j
public class CacheableTimeSlotServiceImpl implements TimeSlotService {
    private final TimeSlotServiceImpl timeSlotServiceImpl;
    private final Cache<String, List<TimeSlotResponseDTO>> timeSlotCache;
    private final Cache<String, TimeSlotResponseDTO> individualTimeSlotCache;
    private static final String CACHE_KEY_FORMAT = "timeslots:%s:%d:%s:%s:%s";
    private static final String INDIVIDUAL_CACHE_KEY_FORMAT = "timeslot:%d";

    public CacheableTimeSlotServiceImpl(TimeSlotServiceImpl timeSlotServiceImpl,
                                        Cache<String, List<TimeSlotResponseDTO>> timeSlotCache,
                                        Cache<String, TimeSlotResponseDTO> individualTimeSlotCache) {
        this.timeSlotServiceImpl = timeSlotServiceImpl;
        this.timeSlotCache = timeSlotCache;
        this.individualTimeSlotCache = individualTimeSlotCache;
        log.info("CacheableTimeSlotServiceImpl initialized");
    }

    private String generateCacheKey(String idType, Integer id, LocalDate startDate, LocalDate endDate, Boolean isAvailable) {
        return String.format(CACHE_KEY_FORMAT, idType.toLowerCase(), id, startDate, endDate, isAvailable != null ? isAvailable : "all");
    }

    private String generateIndividualCacheKey(Integer timeSlotId) {
        return String.format(INDIVIDUAL_CACHE_KEY_FORMAT, timeSlotId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimeSlotResponseDTO> getTimeSlotsByDateRangeAndAvailability(
            String idType, Integer id, LocalDate startDate, LocalDate endDate, Boolean isAvailable) {
        String cacheKey = generateCacheKey(idType, id, startDate, endDate, isAvailable);
        return timeSlotCache.get(cacheKey, k -> {
            log.debug("Cache miss for key: {}", k);
            return timeSlotServiceImpl.getTimeSlotsByDateRangeAndAvailability(idType, id, startDate, endDate, isAvailable);
        });
    }

    @Override
    @Transactional
    public List<TimeSlotResponseDTO> createTimeSlots(String idType, Integer id, LocalDate startDate,
                                                     LocalDate endDate, TimeSlotCreateRequestDTO request) {
        List<TimeSlotResponseDTO> response = timeSlotServiceImpl.createTimeSlots(idType, id, startDate, endDate, request);
        invalidateCache(idType, id);
        return response;
    }

    @Override
    @Transactional
    public TimeSlotResponseDTO updateTimeSlot(String idType, Integer id, Integer timeSlotId,
                                              TimeSlotCreateRequestDTO.TimeSlotDTO timeSlotDTO) {
        TimeSlotResponseDTO response = timeSlotServiceImpl.updateTimeSlot(idType, id, timeSlotId, timeSlotDTO);
        invalidateCache(idType, id);
        individualTimeSlotCache.put(generateIndividualCacheKey(timeSlotId), response);
        return response;
    }

    @Override
    @Transactional
    public void deleteTimeSlot(String idType, Integer id, Integer timeSlotId) {
        timeSlotServiceImpl.deleteTimeSlot(idType, id, timeSlotId);
        invalidateCache(idType, id);
        individualTimeSlotCache.invalidate(generateIndividualCacheKey(timeSlotId));
    }

    @Override
    @Transactional
    public void deleteTimeSlotsInDateRangeAndAvailability(String idType, Integer id,
                                                          LocalDate startDate, LocalDate endDate, Boolean isAvailable) {
        timeSlotServiceImpl.deleteTimeSlotsInDateRangeAndAvailability(idType, id, startDate, endDate, isAvailable);
        invalidateCache(idType, id);
    }

    private void invalidateCache(String idType, Integer id) {
        String prefix = String.format("timeslots:%s:%d", idType.toLowerCase(), id);
        timeSlotCache.asMap().keySet().stream()
                .filter(key -> key.startsWith(prefix))
                .forEach(key -> {
                    timeSlotCache.invalidate(key);
                    log.debug("Invalidated cache: {}", key);
                });
    }

    public void logCacheStats() {
        log.info("TimeSlot Cache Stats: {}", timeSlotCache.stats());
        log.info("Individual TimeSlot Cache Stats: {}", individualTimeSlotCache.stats());
    }
}