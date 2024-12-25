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
    private final Cache<String, ListenerApplicationResponseDTO> listenerApplicationCache;
    private final Cache<String, List<ListenerApplicationSummaryResponseDTO>> listenerApplicationListCache;
    private final Cache<String, ListenerDetailsResponseDTO> listenerDetailsCache;
    private static final Logger logger = LoggerFactory.getLogger(CacheableListenerApplicationServiceImpl.class);
    private final JwtUtils jwtUtils;
    private final ListenerApplicationRepository listenerApplicationRepository;

    public CacheableListenerApplicationServiceImpl(ListenerApplicationServiceImpl listenerApplicationServiceImpl,
                                                   Cache<String, ListenerApplicationResponseDTO> listenerApplicationCache,
                                                   Cache<String, List<ListenerApplicationSummaryResponseDTO>> listenerApplicationListCache,
                                                   Cache<String, ListenerDetailsResponseDTO> listenerDetailsCache, JwtUtils jwtUtils, ListenerApplicationRepository listenerApplicationRepository) {
        this.listenerApplicationServiceImpl = listenerApplicationServiceImpl;
        this.listenerApplicationCache = listenerApplicationCache;
        this.listenerApplicationListCache = listenerApplicationListCache;
        this.listenerDetailsCache = listenerDetailsCache;
        this.jwtUtils = jwtUtils;
        this.listenerApplicationRepository = listenerApplicationRepository;
    }

    private String generateApplicationKey(Integer id) {
        return String.format("application:%d", id);
    }

    private String generateUserApplicationKey(Integer userId) {
        return String.format("user-application:%d", userId);
    }

    private String generateListKey(String type) {
        return String.format("applications:%s", type.toLowerCase());
    }

    @Override
    @Transactional
    public ListenerApplicationResponseDTO submitApplication(ListenerApplicationRequestDTO dto, MultipartFile certificate) throws Exception {
        ListenerApplicationResponseDTO response = listenerApplicationServiceImpl.submitApplication(dto, certificate);
        String key = generateApplicationKey(response.getApplicationId());
        listenerApplicationCache.put(key, response);
        invalidateListCaches();
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

        String key = generateApplicationKey(applicationId);
        Integer finalApplicationId = applicationId;
        return listenerApplicationCache.get(key, k -> listenerApplicationServiceImpl.getApplicationById(finalApplicationId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ListenerApplicationSummaryResponseDTO> getAllApplications() {
        return listenerApplicationListCache.get("all", k -> listenerApplicationServiceImpl.getAllApplications());
    }

    @Override
    @Transactional
    public void deleteApplication(Integer applicationId) {
        listenerApplicationServiceImpl.deleteApplication(applicationId);
        invalidateApplicationCaches(applicationId);
    }

    @Override
    @Transactional
    public ListenerApplicationResponseDTO updateApplication(Integer applicationId, ListenerApplicationRequestDTO dto, MultipartFile certificate) throws Exception {
        ListenerApplicationResponseDTO response = listenerApplicationServiceImpl.updateApplication(applicationId, dto, certificate);
        String key = generateApplicationKey(applicationId);
        listenerApplicationCache.put(key, response);
        invalidateListCaches();
        return response;
    }

    @Override
    @Transactional
    public ListenerDetailsResponseDTO updateApplicationStatus(Integer applicationId, String status) {
        ListenerDetailsResponseDTO response = listenerApplicationServiceImpl.updateApplicationStatus(applicationId, status);
        invalidateApplicationCaches(applicationId);
        if (response != null) {
            String detailsKey = String.format("listener-details:%d", response.getListenerId());
            listenerDetailsCache.put(detailsKey, response);
        }
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ListenerApplicationSummaryResponseDTO> getApplicationByApprovalStatus(String status) {
        String key = generateListKey(status);
        return listenerApplicationListCache.get(key, k -> listenerApplicationServiceImpl.getApplicationByApprovalStatus(status));
    }

    @Override
    @Transactional(readOnly = true)
    public ListenerApplicationResponseDTO getApplicationsByUserId(Integer userId) {
        String key = generateUserApplicationKey(userId);
        return listenerApplicationCache.get(key, k -> listenerApplicationServiceImpl.getApplicationsByUserId(userId));
    }

    private void invalidateApplicationCaches(Integer applicationId) {
        listenerApplicationCache.invalidate(generateApplicationKey(applicationId));
        invalidateListCaches();
    }

    private void invalidateListCaches() {
        listenerApplicationListCache.invalidateAll();
    }

    public void logCacheStats() {
        logger.info("Listener Application Cache Stats: {}", listenerApplicationCache.stats());
        logger.info("Listener Application List Cache Stats: {}", listenerApplicationListCache.stats());
    }
}