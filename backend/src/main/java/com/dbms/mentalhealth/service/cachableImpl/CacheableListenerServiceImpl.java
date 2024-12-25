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

    public CacheableListenerServiceImpl(ListenerServiceImpl listenerServiceImpl,
                                        Cache<String, ListenerDetailsResponseDTO> listenerDetailsCache,
                                        Cache<String, List<UserActivityDTO>> listenerListCache) {
        this.listenerServiceImpl = listenerServiceImpl;
        this.listenerDetailsCache = listenerDetailsCache;
        this.listenerListCache = listenerListCache;
        logger.info("CacheableListenerServiceImpl initialized");
    }

    private String generateListenerKey(String type, Integer id) {
        return String.format("listener:%s:%d", type.toLowerCase(), id);
    }

    private String generateListKey(String type) {
        return String.format("listeners:%s", type.toLowerCase());
    }

    @Override
    @Transactional(readOnly = true)
    public ListenerDetailsResponseDTO getListenerDetails(String type, Integer id) {
        String cacheKey = generateListenerKey(type, id);
        return listenerDetailsCache.get(cacheKey, k -> {
            logger.info("Cache miss for key: {}", k);
            return listenerServiceImpl.getListenerDetails(type, id);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserActivityDTO> getAllListeners(String type) {
        String cacheKey = generateListKey(type);
        return listenerListCache.get(cacheKey, k -> {
            logger.info("Cache miss for key: {}", k);
            return listenerServiceImpl.getAllListeners(type);
        });
    }

    @Override
    @Transactional
    public String suspendOrUnsuspendListener(Integer listenerId, String action) {
        String response = listenerServiceImpl.suspendOrUnsuspendListener(listenerId, action);
        invalidateListenerCaches(listenerId);
        return response;
    }

    private void invalidateListenerCaches(Integer listenerId) {
        listenerDetailsCache.invalidate(generateListenerKey("listenerId", listenerId));
        listenerDetailsCache.invalidate(generateListenerKey("userId", listenerId));
        listenerListCache.invalidateAll();
        logger.info("Invalidated caches for listener: {}", listenerId);
    }

    @Override
    @Transactional
    public void incrementMessageCount(String username) {
        listenerServiceImpl.incrementMessageCount(username);
        listenerListCache.invalidateAll();
        logger.info("Invalidated list cache after message count update for: {}", username);
    }

    public void logCacheStats() {
        logger.info("Listener Details Cache Stats: {}", listenerDetailsCache.stats());
        logger.info("Listener List Cache Stats: {}", listenerListCache.stats());
    }
}