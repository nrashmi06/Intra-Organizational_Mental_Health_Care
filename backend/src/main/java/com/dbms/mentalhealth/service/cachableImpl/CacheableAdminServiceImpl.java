package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.Admin.request.AdminProfileRequestDTO;
import com.dbms.mentalhealth.dto.Admin.response.*;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.AdminService;
import com.dbms.mentalhealth.service.impl.AdminServiceImpl;
import com.dbms.mentalhealth.util.Cache.*;
import com.dbms.mentalhealth.util.Cache.CacheKey.AdminCacheKey;
import com.dbms.mentalhealth.util.Cache.KeyEnum.AdminKeyType;
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
    private final Cache<AdminCacheKey, List<AdminProfileSummaryResponseDTO>> adminListCache;
    private final JwtUtils jwtUtils;

    public CacheableAdminServiceImpl(
            AdminServiceImpl adminServiceImpl,
            Cache<AdminCacheKey, List<AdminProfileSummaryResponseDTO>> adminListCache,
            JwtUtils jwtUtils
    ) {
        this.adminServiceImpl = adminServiceImpl;
        this.adminListCache = adminListCache;
        this.jwtUtils = jwtUtils;
        logger.info("CacheableAdminServiceImpl initialized with cache stats enabled");
    }

    @Override
    @Transactional(readOnly = true)
    public FullAdminProfileResponseDTO getAdminProfile(Integer userId, Integer adminId) {
        if (userId == null && adminId == null) {
            userId = jwtUtils.getUserIdFromContext();
        }
        return adminServiceImpl.getAdminProfile(userId, adminId);
    }

    @Override
    @Transactional
    public FullAdminProfileResponseDTO createAdminProfile(AdminProfileRequestDTO adminProfileRequestDTO, MultipartFile profilePicture) throws Exception {
        FullAdminProfileResponseDTO response = adminServiceImpl.createAdminProfile(adminProfileRequestDTO, profilePicture);
        CacheUtils.invalidateAllCache(adminListCache);
        return response;
    }

    @Override
    @Transactional
    public FullAdminProfileResponseDTO updateAdminProfile(AdminProfileRequestDTO adminProfileRequestDTO, MultipartFile profilePicture) throws Exception {
        FullAdminProfileResponseDTO response = adminServiceImpl.updateAdminProfile(adminProfileRequestDTO, profilePicture);
        CacheUtils.invalidateAllCache(adminListCache);
        return response;
    }

    @Override
    @Transactional
    public String deleteAdminProfile(Integer adminId) {
        String result = adminServiceImpl.deleteAdminProfile(adminId);
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
        logger.info("=== Admin List Cache Statistics ===");
        CacheUtils.logCacheStats(adminListCache, "admin List Cache");
    }
}