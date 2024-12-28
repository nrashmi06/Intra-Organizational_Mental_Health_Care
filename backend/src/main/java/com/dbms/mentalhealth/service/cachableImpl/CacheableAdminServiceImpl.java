package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.Admin.request.AdminProfileRequestDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileResponseDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileSummaryResponseDTO;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.AdminService;
import com.dbms.mentalhealth.service.impl.AdminServiceImpl;
import com.dbms.mentalhealth.util.Cache.CacheKey.AdminCacheKey;
import com.dbms.mentalhealth.util.Cache.KeyEnum.AdminKeyType;
import com.dbms.mentalhealth.util.Cache.CacheUtils;
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
    private static final Logger logger = LoggerFactory.getLogger(CacheableAdminServiceImpl.class);

    private final AdminServiceImpl adminServiceImpl;
    private final Cache<AdminCacheKey, AdminProfileResponseDTO> adminCache;
    private final Cache<AdminCacheKey, List<AdminProfileSummaryResponseDTO>> adminListCache;
    private final JwtUtils jwtUtils;

    public CacheableAdminServiceImpl(
            AdminServiceImpl adminServiceImpl,
            Cache<AdminCacheKey, AdminProfileResponseDTO> adminCache,
            Cache<AdminCacheKey, List<AdminProfileSummaryResponseDTO>> adminListCache,
            JwtUtils jwtUtils
    ) {
        this.adminServiceImpl = adminServiceImpl;
        this.adminCache = adminCache;
        this.adminListCache = adminListCache;
        this.jwtUtils = jwtUtils;
        logger.info("CacheableAdminServiceImpl initialized with cache stats enabled");
    }

    @Override
    @Transactional(readOnly = true)
    public AdminProfileResponseDTO getAdminProfile(Integer userId, Integer adminId) {
        AdminCacheKey cacheKey;
        AdminProfileResponseDTO response;

        if (userId == null && adminId == null) {
            userId = jwtUtils.getUserIdFromContext();
            cacheKey = new AdminCacheKey(userId, AdminKeyType.USER_ID);
        } else if (userId != null) {
            cacheKey = new AdminCacheKey(userId, AdminKeyType.USER_ID);
        } else {
            cacheKey = new AdminCacheKey(adminId, AdminKeyType.ADMIN_ID);
        }

        // Try to get from cache first
        response = CacheUtils.getFromCache(adminCache, cacheKey);
        if (response != null) {
            return response;
        }

        // If not in cache, get from service
        response = adminServiceImpl.getAdminProfile(userId, adminId);
        if (response != null) {
            // Cache with both userId and adminId keys
            AdminCacheKey userIdKey = new AdminCacheKey(response.getUserId(), AdminKeyType.USER_ID);
            AdminCacheKey adminIdKey = new AdminCacheKey(response.getAdminId(), AdminKeyType.ADMIN_ID);

            CacheUtils.putInCache(adminCache, userIdKey, response);
            CacheUtils.putInCache(adminCache, adminIdKey, response);
        }

        return response;
    }

    @Override
    @Transactional
    public AdminProfileResponseDTO createAdminProfile(AdminProfileRequestDTO adminProfileRequestDTO, MultipartFile profilePicture) throws Exception {
        AdminProfileResponseDTO response = adminServiceImpl.createAdminProfile(adminProfileRequestDTO, profilePicture);

        // Cache with both keys
        AdminCacheKey userIdKey = new AdminCacheKey(response.getUserId(), AdminKeyType.USER_ID);
        AdminCacheKey adminIdKey = new AdminCacheKey(response.getAdminId(), AdminKeyType.ADMIN_ID);

        CacheUtils.putInCache(adminCache, userIdKey, response);
        CacheUtils.putInCache(adminCache, adminIdKey, response);
        CacheUtils.invalidateAllCache(adminListCache);

        return response;
    }

    @Override
    @Transactional
    public AdminProfileResponseDTO updateAdminProfile(AdminProfileRequestDTO adminProfileRequestDTO, MultipartFile profilePicture) throws Exception {
        Integer userId = jwtUtils.getUserIdFromContext();
        AdminProfileResponseDTO response = adminServiceImpl.updateAdminProfile(adminProfileRequestDTO, profilePicture);

        // Update both cache entries
        AdminCacheKey userIdKey = new AdminCacheKey(userId, AdminKeyType.USER_ID);
        AdminCacheKey adminIdKey = new AdminCacheKey(response.getAdminId(), AdminKeyType.ADMIN_ID);

        CacheUtils.putInCache(adminCache, userIdKey, response);
        CacheUtils.putInCache(adminCache, adminIdKey, response);
        CacheUtils.invalidateAllCache(adminListCache);

        return response;
    }

    @Override
    @Transactional
    public String deleteAdminProfile(Integer adminId) {
        AdminProfileResponseDTO adminProfile = adminServiceImpl.getAdminProfile(null, adminId);

        // Invalidate both cache entries
        AdminCacheKey userIdKey = new AdminCacheKey(adminProfile.getUserId(), AdminKeyType.USER_ID);
        AdminCacheKey adminIdKey = new AdminCacheKey(adminProfile.getAdminId(), AdminKeyType.ADMIN_ID);

        String result = adminServiceImpl.deleteAdminProfile(adminId);
        CacheUtils.invalidateCache(adminCache, userIdKey);
        CacheUtils.invalidateCache(adminCache, adminIdKey);
        CacheUtils.invalidateAllCache(adminListCache);

        return result;
    }

    @Override
    public List<AdminProfileSummaryResponseDTO> getAllAdmins() {
        AdminCacheKey cacheKey = new AdminCacheKey(null, AdminKeyType.ALL_ADMINS);
        List<AdminProfileSummaryResponseDTO> cachedAdmins = CacheUtils.getFromCache(adminListCache, cacheKey);
        if (cachedAdmins != null) {
            return cachedAdmins;
        }

        List<AdminProfileSummaryResponseDTO> response = adminServiceImpl.getAllAdmins();
        CacheUtils.putInCache(adminListCache, cacheKey, response);
        return response;
    }

    public void logCacheStats() {
        CacheUtils.logCacheStats(adminCache);
        CacheUtils.logCacheStats(adminListCache);
    }
}