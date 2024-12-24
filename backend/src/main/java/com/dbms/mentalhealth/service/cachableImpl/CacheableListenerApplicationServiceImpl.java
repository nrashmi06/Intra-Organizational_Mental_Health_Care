package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.listenerApplication.request.ListenerApplicationRequestDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationResponseDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationSummaryResponseDTO;
import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.exception.listener.ListenerApplicationNotFoundException;
import com.dbms.mentalhealth.service.ListenerApplicationService;
import com.dbms.mentalhealth.service.impl.ListenerApplicationServiceImpl;
import com.github.benmanes.caffeine.cache.Cache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
@Primary
public class CacheableListenerApplicationServiceImpl implements ListenerApplicationService {

    private final ListenerApplicationServiceImpl listenerApplicationServiceImpl;
    private final Cache<Integer, ListenerApplicationResponseDTO> listenerApplicationCache;
    private final Cache<String, List<ListenerApplicationSummaryResponseDTO>> listenerApplicationListCache;
    private final Cache<String, ListenerDetailsResponseDTO> listenerDetailsCache;
    private static final Logger logger = LoggerFactory.getLogger(CacheableListenerApplicationServiceImpl.class);

    public CacheableListenerApplicationServiceImpl(ListenerApplicationServiceImpl listenerApplicationServiceImpl, Cache<Integer, ListenerApplicationResponseDTO> listenerApplicationCache, Cache<String, List<ListenerApplicationSummaryResponseDTO>> listenerApplicationListCache, Cache<String, ListenerDetailsResponseDTO> listenerDetailsCache) {
        this.listenerApplicationServiceImpl = listenerApplicationServiceImpl;
        this.listenerApplicationCache = listenerApplicationCache;
        this.listenerApplicationListCache = listenerApplicationListCache;
        this.listenerDetailsCache = listenerDetailsCache;
        logger.info("CacheableListenerApplicationServiceImpl initialized with cache stats enabled");
    }

    @Override
    @Transactional
    public ListenerApplicationResponseDTO submitApplication(ListenerApplicationRequestDTO applicationRequestDTO, MultipartFile certificate) throws Exception {
        ListenerApplicationResponseDTO response = listenerApplicationServiceImpl.submitApplication(applicationRequestDTO, certificate);
        listenerApplicationCache.put(response.getApplicationId(), response);
        listenerApplicationListCache.invalidateAll();
        logger.info("Cached new listener application and invalidated list cache after application submission");
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public ListenerApplicationResponseDTO getApplicationById(Integer applicationId) {
        if (applicationId == null) {
            logger.warn("Null application ID received");
            throw new ListenerApplicationNotFoundException("Listener Application ID cannot be null");
        }

        logger.info("Cache lookup for listener application ID: {}", applicationId);
        ListenerApplicationResponseDTO cachedApplication = listenerApplicationCache.getIfPresent(applicationId);

        if (cachedApplication != null) {
            logger.debug("Cache HIT - Returning cached listener application for ID: {}", applicationId);
            return cachedApplication;
        }

        logger.info("Cache MISS - Fetching listener application from database for ID: {}", applicationId);
        ListenerApplicationResponseDTO response = listenerApplicationServiceImpl.getApplicationById(applicationId);

        if (response != null) {
            listenerApplicationCache.put(applicationId, response);
            logger.debug("Cached listener application for ID: {}", applicationId);
        }
        return response;
    }
    @Override
    @Transactional(readOnly = true)
    public List<ListenerApplicationSummaryResponseDTO> getAllApplications() {
        String cacheKey = "all_applications";
        logger.info("Cache lookup for all listener applications with key: {}", cacheKey);

        List<ListenerApplicationSummaryResponseDTO> cachedApplications = listenerApplicationListCache.getIfPresent(cacheKey);
        if (cachedApplications != null) {
            logger.debug("Cache HIT - Returning cached listener applications");
            return cachedApplications;
        }

        logger.info("Cache MISS - Fetching listener applications from database");
        List<ListenerApplicationSummaryResponseDTO> response = listenerApplicationServiceImpl.getAllApplications();
        listenerApplicationListCache.put(cacheKey, response);
        logger.debug("Cached all listener applications");

        return response;
    }

    @Override
    @Transactional
    public void deleteApplication(Integer applicationId) {
        logger.info("Deleting listener application ID: {} - removing from caches", applicationId);
        listenerApplicationServiceImpl.deleteApplication(applicationId);
        listenerApplicationCache.invalidate(applicationId);
        listenerApplicationListCache.invalidateAll();
        logger.info("Listener application removed from cache and list cache invalidated for application ID: {}", applicationId);
    }

    @Override
    @Transactional
    public ListenerApplicationResponseDTO updateApplication(Integer applicationId, ListenerApplicationRequestDTO applicationRequestDTO, MultipartFile certificate) throws Exception {
        logger.info("Updating listener application ID: {} - updating caches", applicationId);
        ListenerApplicationResponseDTO response = listenerApplicationServiceImpl.updateApplication(applicationId, applicationRequestDTO, certificate);
        listenerApplicationCache.put(applicationId, response);
        listenerApplicationListCache.invalidateAll();
        logger.info("Listener application cache updated and list cache invalidated for application ID: {}", applicationId);
        return response;
    }

    @Override
    @Transactional
    public ListenerDetailsResponseDTO updateApplicationStatus(Integer applicationId, String status) {
        logger.info("Updating application status for listener application ID: {} to {}", applicationId, status);
        ListenerDetailsResponseDTO response = listenerApplicationServiceImpl.updateApplicationStatus(applicationId, status);
        listenerDetailsCache.put(String.valueOf(applicationId), response);
        listenerApplicationListCache.invalidateAll();
        logger.info("Listener details cache updated and list cache invalidated after status update for application ID: {}", applicationId);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ListenerApplicationSummaryResponseDTO> getApplicationByApprovalStatus(String status) {
        String cacheKey = "status_" + status.toLowerCase();
        logger.info("Cache lookup for approval status with key: {}", cacheKey);

        List<ListenerApplicationSummaryResponseDTO> cachedApplications = listenerApplicationListCache.getIfPresent(cacheKey);
        if (cachedApplications != null) {
            logger.debug("Cache HIT - Returning cached applications for status: {}", status);
            return cachedApplications;
        }

        logger.info("Cache MISS - Fetching applications from database for status: {}", status);
        List<ListenerApplicationSummaryResponseDTO> response = listenerApplicationServiceImpl.getApplicationByApprovalStatus(status);
        listenerApplicationListCache.put(cacheKey, response);
        logger.debug("Cached applications for status: {}", status);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public ListenerApplicationResponseDTO getApplicationsByUserId(Integer userId) {
        logger.info("Cache lookup for listener applications by user ID: {}", userId);
        ListenerApplicationResponseDTO cachedApplication = listenerApplicationCache.getIfPresent(userId);

        if (cachedApplication != null) {
            logger.debug("Cache HIT - Returning cached listener application for user ID: {}", userId);
            return cachedApplication;
        }

        logger.info("Cache MISS - Fetching listener application from database for user ID: {}", userId);
        ListenerApplicationResponseDTO response = listenerApplicationServiceImpl.getApplicationsByUserId(userId);
        listenerApplicationCache.put(userId, response);
        return response;
    }

    public void logCacheStats() {
        logger.info("Current Cache Statistics:");
        logger.info("Listener Application Cache - Size: {}", listenerApplicationCache.stats());
        logger.info("Listener Application List Cache - Size: {}", listenerApplicationListCache.stats());
        logger.info("Listener Details Cache - Size: {}", listenerDetailsCache.stats());
    }
}