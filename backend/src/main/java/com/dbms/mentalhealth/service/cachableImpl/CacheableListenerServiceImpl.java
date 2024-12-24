package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.service.ListenerService;
import com.dbms.mentalhealth.service.impl.ListenerServiceImpl;
import com.github.benmanes.caffeine.cache.Cache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Primary
public class CacheableListenerServiceImpl implements ListenerService {

    private final ListenerServiceImpl listenerServiceImpl;
    private final Cache<String, ListenerDetailsResponseDTO> listenerDetailsCache;
    private final Cache<String, List<UserActivityDTO>> listenerListCache;
    private static final Logger logger = LoggerFactory.getLogger(CacheableListenerServiceImpl.class);

    public CacheableListenerServiceImpl(ListenerServiceImpl listenerServiceImpl, Cache<String, ListenerDetailsResponseDTO> listenerDetailsCache, Cache<String, List<UserActivityDTO>> listenerListCache) {
        this.listenerServiceImpl = listenerServiceImpl;
        this.listenerDetailsCache = listenerDetailsCache;
        this.listenerListCache = listenerListCache;
        logger.info("CacheableListenerServiceImpl initialized with cache stats enabled");
    }

    private String generateCacheKey(String type, Integer id) {
        return type + "_" + id;
    }

    @Override
    @Transactional(readOnly = true)
    public ListenerDetailsResponseDTO getListenerDetails(String type, Integer id) {
        String cacheKey = generateCacheKey(type, id);
        logger.info("Cache lookup for listener details with key: {}", cacheKey);
        ListenerDetailsResponseDTO cachedDetails = listenerDetailsCache.getIfPresent(cacheKey);

        if (cachedDetails != null) {
            logger.debug("Cache HIT - Returning cached listener details for key: {}", cacheKey);
            return cachedDetails;
        }

        logger.info("Cache MISS - Fetching listener details from database for key: {}", cacheKey);
        ListenerDetailsResponseDTO response = listenerServiceImpl.getListenerDetails(type, id);
        listenerDetailsCache.put(cacheKey, response);
        logger.debug("Cached listener details for key: {}", cacheKey);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserActivityDTO> getAllListeners(String type) {
        String cacheKey = "all_listeners_" + type.toLowerCase();
        logger.info("Cache lookup for all listeners with key: {}", cacheKey);

        List<UserActivityDTO> cachedListeners = listenerListCache.getIfPresent(cacheKey);
        if (cachedListeners != null) {
            logger.debug("Cache HIT - Returning cached listeners for key: {}", cacheKey);
            return cachedListeners;
        }

        logger.info("Cache MISS - Fetching listeners from database for key: {}", cacheKey);
        List<UserActivityDTO> response = listenerServiceImpl.getAllListeners(type);
        listenerListCache.put(cacheKey, response);
        logger.debug("Cached listeners for key: {}", cacheKey);

        return response;
    }

    @Override
    @Transactional
    public String suspendOrUnsuspendListener(Integer listenerId, String action) {
        logger.info("Suspending or unsuspending listener ID: {} with action: {}", listenerId, action);
        String response = listenerServiceImpl.suspendOrUnsuspendListener(listenerId, action);

        // Invalidate both possible cache keys
        listenerDetailsCache.invalidate(generateCacheKey("listenerId", listenerId));
        listenerDetailsCache.invalidate(generateCacheKey("userId", listenerId));
        listenerListCache.invalidateAll();

        logger.info("Listener details cache invalidated and list cache invalidated for listener ID: {}", listenerId);
        return response;
    }

    @Override
    @Transactional
    public void incrementMessageCount(String username) {
        logger.info("Incrementing message count for username: {}", username);
        listenerServiceImpl.incrementMessageCount(username);
        logger.info("Message count incremented for username: {}", username);
    }

    public void logCacheStats() {
        logger.info("Current Cache Statistics:");
        logger.info("Listener Details Cache - Size: {}", listenerDetailsCache.stats());
        logger.info("Listener List Cache - Size: {}", listenerListCache.stats());
    }
}