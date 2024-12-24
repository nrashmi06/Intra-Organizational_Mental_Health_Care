package com.dbms.mentalhealth.service.cachableImpl;
import com.dbms.mentalhealth.dto.adminSettings.request.AdminSettingsRequestDTO;
import com.dbms.mentalhealth.dto.adminSettings.response.AdminSettingsResponseDTO;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.AdminSettingsService;
import com.dbms.mentalhealth.service.impl.AdminSettingsServiceImpl;
import com.github.benmanes.caffeine.cache.Cache;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.logging.Logger;

@Service
@Primary
public class CacheableAdminSettingsServiceImpl implements AdminSettingsService {

    private final AdminSettingsServiceImpl adminSettingsServiceImpl;
    private final Cache<Integer, AdminSettingsResponseDTO> adminSettingsCache;
    private static final Logger logger = Logger.getLogger(CacheableAdminSettingsServiceImpl.class.getName());
    private final JwtUtils jwtUtils;

    @Autowired
    public CacheableAdminSettingsServiceImpl(AdminSettingsServiceImpl adminSettingsServiceImpl, Cache<Integer, AdminSettingsResponseDTO> adminSettingsCache, JwtUtils jwtUtils) {
        this.adminSettingsServiceImpl = adminSettingsServiceImpl;
        this.adminSettingsCache = adminSettingsCache;
        logger.info("CacheableAdminSettingsServiceImpl initialized with cache stats enabled");
        this.jwtUtils = jwtUtils;
    }

    @Override
    @Transactional
    public AdminSettingsResponseDTO createAdminSettings(AdminSettingsRequestDTO adminSettingsRequestDTO) {
        Integer userId = jwtUtils.getUserIdFromContext();
        AdminSettingsResponseDTO responseDTO = adminSettingsServiceImpl.createAdminSettings(adminSettingsRequestDTO);
        adminSettingsCache.put(userId, responseDTO);
        logger.info("Cached admin settings for user ID: " + userId);
        return responseDTO;
    }

    @Override
    @Transactional
    public AdminSettingsResponseDTO updateAdminSettings(AdminSettingsRequestDTO adminSettingsRequestDTO) {
        Integer userId = jwtUtils.getUserIdFromContext();
        AdminSettingsResponseDTO responseDTO = adminSettingsServiceImpl.updateAdminSettings(adminSettingsRequestDTO);
        adminSettingsCache.put(userId, responseDTO);
        logger.info("Updated and cached admin settings for user ID: " + userId);
        return responseDTO;
    }

    @Override
    @Transactional
    public void deleteAdminSettings() {
        Integer userId = jwtUtils.getUserIdFromContext();
        adminSettingsServiceImpl.deleteAdminSettings();
        adminSettingsCache.invalidate(userId);
        logger.info("Admin settings removed from cache for user ID: " + userId);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminSettingsResponseDTO getAdminSettings() {
        Integer userId = jwtUtils.getUserIdFromContext();
        logger.info("Cache lookup for admin settings with user ID: " + userId);
        AdminSettingsResponseDTO cachedSettings = adminSettingsCache.getIfPresent(userId);

        if (cachedSettings != null) {
            logger.info("Cache HIT - Returning cached admin settings for user ID: " + userId);
            return cachedSettings;
        }

        logger.info("Cache MISS - Fetching admin settings from database for user ID: " + userId);
        AdminSettingsResponseDTO responseDTO = adminSettingsServiceImpl.getAdminSettings();
        adminSettingsCache.put(userId, responseDTO);
        logger.info("Cached admin settings for user ID: " + userId);

        return responseDTO;
    }


}