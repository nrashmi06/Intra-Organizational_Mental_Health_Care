//package com.dbms.mentalhealth.service.cachableImpl;
//
//import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
//import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
//import com.dbms.mentalhealth.repository.ListenerRepository;
//import com.dbms.mentalhealth.service.ListenerService;
//import com.dbms.mentalhealth.service.impl.ListenerServiceImpl;
//import com.dbms.mentalhealth.util.Cache.CacheKey.ListenerCacheKey;
//import com.dbms.mentalhealth.util.Cache.KeyEnum.ListenerRelatedKeyType;
//import com.dbms.mentalhealth.util.Cache.CacheUtils;
//import com.github.benmanes.caffeine.cache.Cache;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.context.annotation.Primary;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
//@Service
//@Primary
//public class CacheableListenerServiceImpl implements ListenerService {
//    private final ListenerServiceImpl listenerServiceImpl;
//    private final Cache<ListenerCacheKey, ListenerDetailsResponseDTO> listenerDetailsCache;
//    private final Cache<ListenerCacheKey, List<UserActivityDTO>> listenerListCache;
//    private static final Logger logger = LoggerFactory.getLogger(CacheableListenerServiceImpl.class);
//    private final ListenerRepository listenerRepository;
//
//    public CacheableListenerServiceImpl(ListenerServiceImpl listenerServiceImpl,
//                                        Cache<ListenerCacheKey, ListenerDetailsResponseDTO> listenerDetailsCache,
//                                        Cache<ListenerCacheKey, List<UserActivityDTO>> listenerListCache, ListenerRepository listenerRepository) {
//        this.listenerServiceImpl = listenerServiceImpl;
//        this.listenerDetailsCache = listenerDetailsCache;
//        this.listenerListCache = listenerListCache;
//        logger.info("CacheableListenerServiceImpl initialized with cache stats enabled");
//        this.listenerRepository = listenerRepository;
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public ListenerDetailsResponseDTO getListenerDetails(String type, Integer id) {
//        ListenerRelatedKeyType keyType = type.equalsIgnoreCase("userId") ?
//                ListenerRelatedKeyType.LISTENER_BY_USER_ID :
//                ListenerRelatedKeyType.LISTENER_BY_ID;
//
//        ListenerCacheKey cacheKey = new ListenerCacheKey(id, keyType, type);
//        logger.info("Cache lookup for listener details with type: {} and ID: {}", type, id);
//
//        return listenerDetailsCache.get(cacheKey, k -> {
//            logger.info("Cache MISS - Fetching listener details from database for type: {} and ID: {}", type, id);
//            return listenerServiceImpl.getListenerDetails(type, id);
//        });
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<UserActivityDTO> getListenersByFilters(String status, String searchTerm, Pageable pageable) {
//        return listenerServiceImpl.getListenersByFilters(status,searchTerm,pageable);
//    }
//
//    @Override
//    @Transactional
//    public String suspendOrUnsuspendListener(Integer listenerId, String action) {
//        String response = listenerServiceImpl.suspendOrUnsuspendListener(listenerId, action);
//        clearAllCaches();
//        logger.info("Updated listener status and cleared all caches for listener ID: {}", listenerId);
//        return response;
//    }
//
//    private void clearAllCaches() {
//        listenerDetailsCache.invalidateAll();
//        listenerListCache.invalidateAll();
//        logger.info("Cleared all caches");
//    }
//    @Override
//    @Transactional
//    public void incrementMessageCount(String username) {
//        listenerServiceImpl.incrementMessageCount(username);
//        // Invalidate all list caches since message counts changed
//        listenerListCache.invalidate(new ListenerCacheKey("all", ListenerRelatedKeyType.ALL_LISTENERS));
//        listenerListCache.invalidate(new ListenerCacheKey("active", ListenerRelatedKeyType.ACTIVE_LISTENERS));
//        listenerListCache.invalidate(new ListenerCacheKey("suspended", ListenerRelatedKeyType.SUSPENDED_LISTENERS));
//        logger.info("Invalidated list caches after message count update for user: {}", username);
//    }
//
//    public void logCacheStats() {
//        CacheUtils.logCacheStats(listenerDetailsCache);
//        CacheUtils.logCacheStats(listenerListCache);
//    }
//}