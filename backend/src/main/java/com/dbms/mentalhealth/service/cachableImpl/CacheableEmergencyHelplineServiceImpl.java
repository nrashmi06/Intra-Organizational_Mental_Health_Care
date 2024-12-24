// CacheableEmergencyHelplineServiceImpl.java
package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.EmergencyHelpline.EmergencyHelplineDTO;
import com.dbms.mentalhealth.service.EmergencyHelplineService;
import com.dbms.mentalhealth.service.impl.EmergencyHelplineServiceImpl;
import com.github.benmanes.caffeine.cache.Cache;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.logging.Logger;

@Service
@Primary
public class CacheableEmergencyHelplineServiceImpl implements EmergencyHelplineService {

    private final EmergencyHelplineServiceImpl emergencyHelplineServiceImpl;
    private final Cache<Integer, EmergencyHelplineDTO> emergencyHelplineCache;
    private final Cache<Integer, List<EmergencyHelplineDTO>> emergencyHelplineListCache;
    private static final Logger logger = Logger.getLogger(CacheableEmergencyHelplineServiceImpl.class.getName());

    public CacheableEmergencyHelplineServiceImpl(EmergencyHelplineServiceImpl emergencyHelplineServiceImpl, Cache<Integer, EmergencyHelplineDTO> emergencyHelplineCache, Cache<Integer, List<EmergencyHelplineDTO>> emergencyHelplineListCache) {
        this.emergencyHelplineServiceImpl = emergencyHelplineServiceImpl;
        this.emergencyHelplineCache = emergencyHelplineCache;
        this.emergencyHelplineListCache = emergencyHelplineListCache;
        logger.info("CacheableEmergencyHelplineServiceImpl initialized with cache stats enabled");
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmergencyHelplineDTO> getAllEmergencyHelplines() {
        int cacheKey = "all_helplines".hashCode();
        logger.info("Cache lookup for all emergency helplines with key: " + cacheKey);

        List<EmergencyHelplineDTO> cachedHelplines = emergencyHelplineListCache.getIfPresent(cacheKey);
        if (cachedHelplines != null) {
            logger.info("Cache HIT - Returning cached emergency helplines");
            return cachedHelplines;
        }

        logger.info("Cache MISS - Fetching emergency helplines from database");
        List<EmergencyHelplineDTO> response = emergencyHelplineServiceImpl.getAllEmergencyHelplines();
        emergencyHelplineListCache.put(cacheKey, response);
        logger.info("Cached all emergency helplines");

        return response;
    }

    @Override
    @Transactional
    public EmergencyHelplineDTO addEmergencyHelpline(EmergencyHelplineDTO emergencyHelplineDTO) {
        EmergencyHelplineDTO response = emergencyHelplineServiceImpl.addEmergencyHelpline(emergencyHelplineDTO);
        emergencyHelplineCache.put(response.getHelplineId(), response);
        emergencyHelplineListCache.invalidateAll(); // Invalidate list cache to ensure consistency
        logger.info("Added new emergency helpline to cache and invalidated list cache after creation");
        return response;
    }

    @Override
    @Transactional
    public EmergencyHelplineDTO updateEmergencyHelpline(Integer helplineId, EmergencyHelplineDTO emergencyHelplineDTO) {
        EmergencyHelplineDTO response = emergencyHelplineServiceImpl.updateEmergencyHelpline(helplineId, emergencyHelplineDTO);
        emergencyHelplineCache.put(helplineId, response);
        emergencyHelplineListCache.invalidateAll();
        logger.info("Updated emergency helpline cache and invalidated list cache for helpline ID: " + helplineId);
        return response;
    }

    @Override
    @Transactional
    public void deleteEmergencyHelpline(Integer helplineId) {
        emergencyHelplineServiceImpl.deleteEmergencyHelpline(helplineId);
        emergencyHelplineCache.invalidate(helplineId);
        emergencyHelplineListCache.invalidateAll();
        logger.info("Emergency helpline removed from cache and list cache invalidated for helpline ID: " + helplineId);
    }
}