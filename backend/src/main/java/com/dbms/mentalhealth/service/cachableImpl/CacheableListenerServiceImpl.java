package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.service.ListenerService;
import com.dbms.mentalhealth.service.impl.ListenerServiceImpl;
import com.dbms.mentalhealth.util.Cache.CacheKey.ListenerCacheKey;
import com.dbms.mentalhealth.util.Cache.KeyEnum.ListenerRelatedKeyType;
import com.dbms.mentalhealth.util.Cache.CacheUtils;
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
    private final Cache<ListenerCacheKey, ListenerDetailsResponseDTO> listenerDetailsCache;
    private final Cache<ListenerCacheKey, List<UserActivityDTO>> listenerListCache;
    private static final Logger logger = LoggerFactory.getLogger(CacheableListenerServiceImpl.class);

    public CacheableListenerServiceImpl(ListenerServiceImpl listenerServiceImpl,
                                        Cache<ListenerCacheKey, ListenerDetailsResponseDTO> listenerDetailsCache,
                                        Cache<ListenerCacheKey, List<UserActivityDTO>> listenerListCache) {
        this.listenerServiceImpl = listenerServiceImpl;
        this.listenerDetailsCache = listenerDetailsCache;
        this.listenerListCache = listenerListCache;
        logger.info("CacheableListenerServiceImpl initialized with cache stats enabled");
    }

    @Override
    @Transactional(readOnly = true)
    public ListenerDetailsResponseDTO getListenerDetails(String type, Integer id) {
        ListenerRelatedKeyType keyType = type.equalsIgnoreCase("userId") ?
                ListenerRelatedKeyType.LISTENER_BY_USER_ID :
                ListenerRelatedKeyType.LISTENER_BY_ID;

        ListenerCacheKey cacheKey = new ListenerCacheKey(id, keyType, type);
        logger.info("Cache lookup for listener details with type: {} and ID: {}", type, id);

        return listenerDetailsCache.get(cacheKey, k -> {
            logger.info("Cache MISS - Fetching listener details from database for type: {} and ID: {}", type, id);
            return listenerServiceImpl.getListenerDetails(type, id);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserActivityDTO> getAllListeners(String type) {
        ListenerRelatedKeyType keyType;
        switch (type.toLowerCase()) {
            case "active":
                keyType = ListenerRelatedKeyType.ACTIVE_LISTENERS;
                break;
            case "suspended":
                keyType = ListenerRelatedKeyType.SUSPENDED_LISTENERS;
                break;
            default:
                keyType = ListenerRelatedKeyType.ALL_LISTENERS;
        }

        ListenerCacheKey cacheKey = new ListenerCacheKey(type, keyType);
        logger.info("Cache lookup for listeners of type: {}", type);

        return listenerListCache.get(cacheKey, k -> {
            logger.info("Cache MISS - Fetching {} listeners from database", type);
            return listenerServiceImpl.getAllListeners(type);
        });
    }

    @Override
    @Transactional
    public String suspendOrUnsuspendListener(Integer listenerId, String action) {
        String response = listenerServiceImpl.suspendOrUnsuspendListener(listenerId, action);
        invalidateListenerCaches(listenerId);
        logger.info("Updated listener status and invalidated caches for listener ID: {}", listenerId);
        return response;
    }

    private void invalidateListenerCaches(Integer listenerId) {
        // Invalidate both by ID and by UserID caches
        listenerDetailsCache.invalidate(new ListenerCacheKey(listenerId, ListenerRelatedKeyType.LISTENER_BY_ID, "listenerId"));
        listenerDetailsCache.invalidate(new ListenerCacheKey(listenerId, ListenerRelatedKeyType.LISTENER_BY_USER_ID, "userId"));

        // Invalidate all list caches since the status changed
        listenerListCache.invalidate(new ListenerCacheKey("all", ListenerRelatedKeyType.ALL_LISTENERS));
        listenerListCache.invalidate(new ListenerCacheKey("active", ListenerRelatedKeyType.ACTIVE_LISTENERS));
        listenerListCache.invalidate(new ListenerCacheKey("suspended", ListenerRelatedKeyType.SUSPENDED_LISTENERS));

        logger.info("Invalidated all related caches for listener ID: {}", listenerId);
    }

    @Override
    @Transactional
    public void incrementMessageCount(String username) {
        listenerServiceImpl.incrementMessageCount(username);
        // Invalidate all list caches since message counts changed
        listenerListCache.invalidate(new ListenerCacheKey("all", ListenerRelatedKeyType.ALL_LISTENERS));
        listenerListCache.invalidate(new ListenerCacheKey("active", ListenerRelatedKeyType.ACTIVE_LISTENERS));
        listenerListCache.invalidate(new ListenerCacheKey("suspended", ListenerRelatedKeyType.SUSPENDED_LISTENERS));
        logger.info("Invalidated list caches after message count update for user: {}", username);
    }

    public void logCacheStats() {
        CacheUtils.logCacheStats(listenerDetailsCache);
        CacheUtils.logCacheStats(listenerListCache);
    }
}