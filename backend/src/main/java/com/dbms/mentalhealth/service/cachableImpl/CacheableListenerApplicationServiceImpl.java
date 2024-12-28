package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.listenerApplication.request.ListenerApplicationRequestDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationResponseDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationSummaryResponseDTO;
import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.exception.listener.ListenerApplicationNotFoundException;
import com.dbms.mentalhealth.model.ListenerApplication;
import com.dbms.mentalhealth.repository.ListenerApplicationRepository;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.ListenerApplicationService;
import com.dbms.mentalhealth.service.impl.ListenerApplicationServiceImpl;
import com.dbms.mentalhealth.util.Cache.CacheKey.ListenerApplicationCacheKey;
import com.dbms.mentalhealth.util.Cache.KeyEnum.ListenerRelatedKeyType;
import com.dbms.mentalhealth.util.Cache.CacheUtils;
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
    private final Cache<ListenerApplicationCacheKey, ListenerApplicationResponseDTO> applicationCache;
    private final Cache<ListenerApplicationCacheKey, List<ListenerApplicationSummaryResponseDTO>> applicationListCache;
    private final Cache<ListenerApplicationCacheKey, ListenerDetailsResponseDTO> listenerDetailsCache;
    private static final Logger logger = LoggerFactory.getLogger(CacheableListenerApplicationServiceImpl.class);
    private final JwtUtils jwtUtils;
    private final ListenerApplicationRepository listenerApplicationRepository;

    public CacheableListenerApplicationServiceImpl(ListenerApplicationServiceImpl listenerApplicationServiceImpl,
                                                   Cache<ListenerApplicationCacheKey, ListenerApplicationResponseDTO> applicationCache,
                                                   Cache<ListenerApplicationCacheKey, List<ListenerApplicationSummaryResponseDTO>> applicationListCache,
                                                   Cache<ListenerApplicationCacheKey, ListenerDetailsResponseDTO> listenerDetailsCache,
                                                   JwtUtils jwtUtils,
                                                   ListenerApplicationRepository listenerApplicationRepository) {
        this.listenerApplicationServiceImpl = listenerApplicationServiceImpl;
        this.applicationCache = applicationCache;
        this.applicationListCache = applicationListCache;
        this.listenerDetailsCache = listenerDetailsCache;
        this.jwtUtils = jwtUtils;
        this.listenerApplicationRepository = listenerApplicationRepository;
        logger.info("CacheableListenerApplicationServiceImpl initialized with cache stats enabled");
    }

    @Override
    @Transactional
    public ListenerApplicationResponseDTO submitApplication(ListenerApplicationRequestDTO dto, MultipartFile certificate) throws Exception {
        ListenerApplicationResponseDTO response = listenerApplicationServiceImpl.submitApplication(dto, certificate);
        ListenerApplicationCacheKey key = new ListenerApplicationCacheKey(response.getApplicationId(), ListenerRelatedKeyType.APPLICATION);
        applicationCache.put(key, response);
        invalidateListCaches();
        logger.info("Added new application to cache and invalidated list caches after submission");
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public ListenerApplicationResponseDTO getApplicationById(Integer applicationId) {
        Integer userId = jwtUtils.getUserIdFromContext();
        String role = jwtUtils.getRoleFromContext();

        ListenerApplication listenerApplication;
        if (applicationId == null) {
            listenerApplication = listenerApplicationRepository.findByUser_UserId(userId);
            if (listenerApplication == null) {
                throw new ListenerApplicationNotFoundException("Listener Application not found for User ID: " + userId);
            }
            if (!listenerApplication.getUser().getUserId().equals(userId) && !"ROLE_ADMIN".equals(role)) {
                throw new ListenerApplicationNotFoundException(
                        "Access denied for Listener Application ID: " + listenerApplication.getApplicationId());
            }
            applicationId = listenerApplication.getApplicationId();
        }

        ListenerApplicationCacheKey key = new ListenerApplicationCacheKey(applicationId, ListenerRelatedKeyType.APPLICATION);
        logger.info("Cache lookup for application ID: {}", applicationId);
        Integer finalApplicationId = applicationId;
        return applicationCache.get(key, k -> {
            logger.info("Cache MISS - Fetching application from database for ID: {}", finalApplicationId);
            return listenerApplicationServiceImpl.getApplicationById(finalApplicationId);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<ListenerApplicationSummaryResponseDTO> getAllApplications() {
        ListenerApplicationCacheKey key = new ListenerApplicationCacheKey("all", ListenerRelatedKeyType.ALL_APPLICATIONS);
        logger.info("Cache lookup for all applications");
        return applicationListCache.get(key, k -> {
            logger.info("Cache MISS - Fetching all applications from database");
            return listenerApplicationServiceImpl.getAllApplications();
        });
    }

    @Override
    @Transactional
    public void deleteApplication(Integer applicationId) {
        listenerApplicationServiceImpl.deleteApplication(applicationId);
        invalidateApplicationCaches(applicationId);
        logger.info("Deleted application and invalidated caches for ID: {}", applicationId);
    }

    @Override
    @Transactional
    public ListenerApplicationResponseDTO updateApplication(Integer applicationId, ListenerApplicationRequestDTO dto, MultipartFile certificate) throws Exception {
        ListenerApplicationResponseDTO response = listenerApplicationServiceImpl.updateApplication(applicationId, dto, certificate);
        ListenerApplicationCacheKey key = new ListenerApplicationCacheKey(applicationId, ListenerRelatedKeyType.APPLICATION);
        applicationCache.put(key, response);
        invalidateListCaches();
        logger.info("Updated application and refreshed caches for ID: {}", applicationId);
        return response;
    }

    @Override
    @Transactional
    public ListenerDetailsResponseDTO updateApplicationStatus(Integer applicationId, String status) {
        ListenerDetailsResponseDTO response = listenerApplicationServiceImpl.updateApplicationStatus(applicationId, status);
        invalidateApplicationCaches(applicationId);
        if (response != null) {
            ListenerApplicationCacheKey detailsKey = new ListenerApplicationCacheKey(response.getListenerId(), ListenerRelatedKeyType.LISTENER_DETAILS);
            listenerDetailsCache.put(detailsKey, response);
        }
        logger.info("Updated application status and refreshed caches for ID: {}", applicationId);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ListenerApplicationSummaryResponseDTO> getApplicationByApprovalStatus(String status) {
        ListenerApplicationCacheKey key = new ListenerApplicationCacheKey(status, ListenerRelatedKeyType.STATUS_APPLICATIONS);
        logger.info("Cache lookup for applications with status: {}", status);
        return applicationListCache.get(key, k -> {
            logger.info("Cache MISS - Fetching applications with status {} from database", status);
            return listenerApplicationServiceImpl.getApplicationByApprovalStatus(status);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public ListenerApplicationResponseDTO getApplicationsByUserId(Integer userId) {
        ListenerApplicationCacheKey key = new ListenerApplicationCacheKey(userId, ListenerRelatedKeyType.USER_APPLICATION);
        logger.info("Cache lookup for application by user ID: {}", userId);
        return applicationCache.get(key, k -> {
            logger.info("Cache MISS - Fetching application for user ID {} from database", userId);
            return listenerApplicationServiceImpl.getApplicationsByUserId(userId);
        });
    }

    private void invalidateApplicationCaches(Integer applicationId) {
        applicationCache.invalidate(new ListenerApplicationCacheKey(applicationId, ListenerRelatedKeyType.APPLICATION));
        invalidateListCaches();
    }

    private void invalidateListCaches() {
        applicationListCache.invalidateAll();
        logger.info("Invalidated all list caches");
    }

    public void logCacheStats() {
        CacheUtils.logCacheStats(applicationCache);
        CacheUtils.logCacheStats(applicationListCache);
        CacheUtils.logCacheStats(listenerDetailsCache);
    }
}