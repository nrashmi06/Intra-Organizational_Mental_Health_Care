package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.Admin.request.AdminProfileRequestDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileResponseDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileSummaryResponseDTO;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.AdminService;
import com.dbms.mentalhealth.service.impl.AdminServiceImpl;
import com.github.benmanes.caffeine.cache.Cache;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@Service
@Primary
public class CacheableAdminServiceImpl implements AdminService {

    private final AdminServiceImpl adminServiceImpl;
    private final Cache<Integer, AdminProfileResponseDTO> adminCache;
    private final Cache<String, List<AdminProfileSummaryResponseDTO>> adminListCache;
    private static final Logger logger = LoggerFactory.getLogger(CacheableAdminServiceImpl.class);
    private final JwtUtils jwtUtils;

    public CacheableAdminServiceImpl(AdminServiceImpl adminServiceImpl, Cache<Integer, AdminProfileResponseDTO> adminCache, Cache<String, List<AdminProfileSummaryResponseDTO>> adminListCache, JwtUtils jwtUtils) {
        this.adminServiceImpl = adminServiceImpl;
        this.adminCache = adminCache;
        this.adminListCache = adminListCache;
        logger.info("CacheableAdminServiceImpl initialized with cache stats enabled");
        this.jwtUtils = jwtUtils;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminProfileResponseDTO getAdminProfile(Integer userId, Integer adminId) {
        Integer cacheKey;
        if (userId == null && adminId == null) {
            cacheKey = jwtUtils.getUserIdFromContext();
        } else if (userId == null) {
            AdminProfileResponseDTO adminProfile = adminServiceImpl.getAdminProfile(null, adminId);
            userId = adminProfile.getUserId();
            cacheKey = userId;
        } else {
            cacheKey = userId;
        }

        logger.info("Cache lookup for admin profile with key: {}", cacheKey);
        AdminProfileResponseDTO cachedAdmin = adminCache.getIfPresent(cacheKey);

        if (cachedAdmin != null) {
            logger.debug("Cache HIT - Returning cached admin profile for key: {}", cacheKey);
            return cachedAdmin;
        }

        logger.info("Cache MISS - Fetching admin profile from database for key: {}", cacheKey);
        AdminProfileResponseDTO response = adminServiceImpl.getAdminProfile(userId, adminId);

        if (response != null) {
            logger.debug("Caching admin profile with key: {}", cacheKey);
            adminCache.put(cacheKey, response);
        }

        return response;
    }

    @Override
    @Transactional
    public AdminProfileResponseDTO createAdminProfile(AdminProfileRequestDTO adminProfileRequestDTO, MultipartFile profilePicture) throws Exception {
        logger.info("Creating new admin profile - invalidating all caches");
        AdminProfileResponseDTO response = adminServiceImpl.createAdminProfile(adminProfileRequestDTO, profilePicture);
        adminCache.invalidateAll();
        adminListCache.invalidateAll();
        logger.info("All caches invalidated after admin profile creation");
        return response;
    }

    @Override
    @Transactional
    public AdminProfileResponseDTO updateAdminProfile(AdminProfileRequestDTO adminProfileRequestDTO, MultipartFile profilePicture) throws Exception {
        Integer userId = jwtUtils.getUserIdFromContext();
        logger.info("Updating admin profile for user ID: {} - updating caches", userId);
        AdminProfileResponseDTO response = adminServiceImpl.updateAdminProfile(adminProfileRequestDTO, profilePicture);
        adminCache.put(userId, response);
        adminListCache.invalidateAll();
        logger.info("Admin profile cache updated and list cache invalidated for user ID: {}", userId);
        return response;
    }

    @Override
    @Transactional
    public String deleteAdminProfile(Integer adminId) {
        logger.info("Deleting admin profile ID: {} - removing from caches", adminId);

        AdminProfileResponseDTO adminProfile = adminServiceImpl.getAdminProfile(null, adminId);
        Integer userId = adminProfile.getUserId();

        String result = adminServiceImpl.deleteAdminProfile(adminId);
        adminCache.invalidate(userId);
        adminListCache.invalidateAll();
        logger.info("Admin profile removed from cache and list cache invalidated for user ID: {}", userId);
        return result;
    }

    @Override
    public List<AdminProfileSummaryResponseDTO> getAllAdmins() {
        String cacheKey = "all_admins";
        logger.info("Cache lookup for all admins with key: {}", cacheKey);

        List<AdminProfileSummaryResponseDTO> cachedAdmins = adminListCache.getIfPresent(cacheKey);
        if (cachedAdmins != null) {
            logger.debug("Cache HIT - Returning cached list of all admins");
            return cachedAdmins;
        }

        logger.info("Cache MISS - Fetching list of all admins from database");
        List<AdminProfileSummaryResponseDTO> response = adminServiceImpl.getAllAdmins();
        adminListCache.put(cacheKey, response);
        logger.debug("Cached list of all admins");

        return response;
    }

    public void logCacheStats() {
        logger.info("Current Cache Statistics:");
        logger.info("Admin Cache - Size: {}", adminCache.estimatedSize());
        logger.info("Admin List Cache - Size: {}", adminListCache.estimatedSize());
    }
}