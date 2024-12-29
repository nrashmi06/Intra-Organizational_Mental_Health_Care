package com.dbms.mentalhealth.util.Cache;

import com.github.benmanes.caffeine.cache.Cache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CacheUtils {
    private static final Logger logger = LoggerFactory.getLogger(CacheUtils.class);

    public static <K, V> V getFromCache(Cache<K, V> cache, K key) {
        logger.info("Cache lookup for key: {}", key);
        V cachedValue = cache.getIfPresent(key);
        if (cachedValue != null) {
            logger.debug("Cache HIT - Returning cached value for key: {}", key);
        } else {
            logger.info("Cache MISS - No cached value for key: {}", key);
        }
        return cachedValue;
    }

    public static <K, V> void putInCache(Cache<K, V> cache, K key, V value) {
        logger.debug("Caching value with key: {}", key);
        cache.put(key, value);
    }

    public static <K> void invalidateCache(Cache<K, ?> cache, K key) {
        logger.info("Invalidating cache for key: {}", key);
        cache.invalidate(key);
    }

    public static void invalidateAllCache(Cache<?, ?> cache) {
        logger.info("Invalidating all cache entries");
        cache.invalidateAll();
    }

    public static void logCacheStats(Cache<?, ?> cache,String cacheName) {
        logger.info(cacheName+" - status: {}", cache.stats());
    }
}