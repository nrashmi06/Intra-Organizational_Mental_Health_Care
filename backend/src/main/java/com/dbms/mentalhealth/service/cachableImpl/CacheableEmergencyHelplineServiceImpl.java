// CacheableEmergencyHelplineServiceImpl.java
package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.EmergencyHelpline.EmergencyHelplineDTO;
import com.dbms.mentalhealth.service.EmergencyHelplineService;
import com.dbms.mentalhealth.service.impl.EmergencyHelplineServiceImpl;
import com.dbms.mentalhealth.util.Cache.CacheKey.EmergencyHelplineCacheKey;
import com.dbms.mentalhealth.util.Cache.CacheUtils;
import com.github.benmanes.caffeine.cache.Cache;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
@Primary
public class CacheableEmergencyHelplineServiceImpl implements EmergencyHelplineService {

    private final EmergencyHelplineServiceImpl emergencyHelplineServiceImpl;
    private final Cache<EmergencyHelplineCacheKey, List<EmergencyHelplineDTO>> emergencyHelplineListCache;
    private static final Logger logger = LoggerFactory.getLogger(CacheableEmergencyHelplineServiceImpl.class);

    private static final EmergencyHelplineCacheKey ALL_HELPLINES_KEY = new EmergencyHelplineCacheKey(0);

    public CacheableEmergencyHelplineServiceImpl(EmergencyHelplineServiceImpl emergencyHelplineServiceImpl, Cache<EmergencyHelplineCacheKey, List<EmergencyHelplineDTO>> emergencyHelplineListCache) {
        this.emergencyHelplineServiceImpl = emergencyHelplineServiceImpl;
        this.emergencyHelplineListCache = emergencyHelplineListCache;
        logger.info("CacheableEmergencyHelplineServiceImpl initialized with cache stats enabled");
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmergencyHelplineDTO> getAllEmergencyHelplines() {
        logger.info("Cache lookup for all emergency helplines with key: {}", ALL_HELPLINES_KEY);

        List<EmergencyHelplineDTO> cachedHelplines = CacheUtils.getFromCache(emergencyHelplineListCache, ALL_HELPLINES_KEY);
        if (cachedHelplines != null) {
            logger.debug("Cache HIT - Returning cached emergency helplines");
            return cachedHelplines;
        }

        logger.info("Cache MISS - Fetching emergency helplines from database");
        List<EmergencyHelplineDTO> response = emergencyHelplineServiceImpl.getAllEmergencyHelplines();
        CacheUtils.putInCache(emergencyHelplineListCache, ALL_HELPLINES_KEY, response);
        logger.debug("Cached all emergency helplines");

        return response;
    }

    @Override
    @Transactional
    public EmergencyHelplineDTO addEmergencyHelpline(EmergencyHelplineDTO emergencyHelplineDTO) {
        EmergencyHelplineDTO response = emergencyHelplineServiceImpl.addEmergencyHelpline(emergencyHelplineDTO);
        CacheUtils.invalidateAllCache(emergencyHelplineListCache); // Invalidate list cache to ensure consistency
        logger.info("Added new emergency helpline and invalidated list cache after creation");
        return response;
    }

    @Override
    @Transactional
    public EmergencyHelplineDTO updateEmergencyHelpline(Integer helplineId, EmergencyHelplineDTO emergencyHelplineDTO) {
        EmergencyHelplineDTO response = emergencyHelplineServiceImpl.updateEmergencyHelpline(helplineId, emergencyHelplineDTO);
        CacheUtils.invalidateAllCache(emergencyHelplineListCache);
        logger.info("Updated emergency helpline and invalidated list cache for helpline ID: {}", helplineId);
        return response;
    }

    @Override
    @Transactional
    public void deleteEmergencyHelpline(Integer helplineId) {
        emergencyHelplineServiceImpl.deleteEmergencyHelpline(helplineId);
        CacheUtils.invalidateAllCache(emergencyHelplineListCache);
        logger.info("Emergency helpline removed and list cache invalidated for helpline ID: {}", helplineId);
    }
}