package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.Appointment.request.AppointmentRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import com.dbms.mentalhealth.enums.AppointmentStatus;
import com.dbms.mentalhealth.enums.AppointmentTimeFilter;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.AppointmentService;
import com.dbms.mentalhealth.service.impl.AppointmentServiceImpl;
import com.dbms.mentalhealth.util.Cache.CacheKey.AppointmentCacheKey;
import com.dbms.mentalhealth.util.Cache.KeyEnum.AppointmentKeyType;
import com.dbms.mentalhealth.util.Cache.CacheUtils;
import com.github.benmanes.caffeine.cache.Cache;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;

@Service
@Primary
public class CacheableAppointmentServiceImpl implements AppointmentService {

    private final AppointmentServiceImpl appointmentServiceImpl;
    private final Cache<AppointmentCacheKey, AppointmentResponseDTO> appointmentCache;
    private final Cache<AppointmentCacheKey, List<AppointmentSummaryResponseDTO>> appointmentListCache;
    private static final Logger logger = LoggerFactory.getLogger(CacheableAppointmentServiceImpl.class);
    private final JwtUtils jwtUtils;

    public CacheableAppointmentServiceImpl(AppointmentServiceImpl appointmentServiceImpl,
                                           Cache<AppointmentCacheKey, AppointmentResponseDTO> appointmentCache,
                                           Cache<AppointmentCacheKey, List<AppointmentSummaryResponseDTO>> appointmentListCache,
                                           JwtUtils jwtUtils) {
        this.appointmentServiceImpl = appointmentServiceImpl;
        this.appointmentCache = appointmentCache;
        this.appointmentListCache = appointmentListCache;
        this.jwtUtils = jwtUtils;
        logger.info("CacheableAppointmentServiceImpl initialized with cache stats enabled");
    }

    private void invalidateUserAndAdminCaches(Integer userId, Integer adminId) {
        if (userId != null) {
            appointmentListCache.invalidate(new AppointmentCacheKey(userId, AppointmentKeyType.USER_APPOINTMENTS));
        }
        if (adminId != null) {
            appointmentListCache.invalidate(new AppointmentCacheKey(adminId, AppointmentKeyType.ADMIN_APPOINTMENTS));
        }
    }

    @Override
    @Transactional
    public AppointmentResponseDTO createAppointment(AppointmentRequestDTO appointmentRequestDTO) {
        Integer userId = jwtUtils.getUserIdFromContext();
        AppointmentResponseDTO response = appointmentServiceImpl.createAppointment(appointmentRequestDTO);
        appointmentCache.put(new AppointmentCacheKey(response.getAppointmentId(), AppointmentKeyType.APPOINTMENT), response);
        invalidateUserAndAdminCaches(userId, appointmentRequestDTO.getAdminId());
        logger.info("Added new appointment to cache and invalidated relevant caches after appointment creation");
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentSummaryResponseDTO> getAppointmentsByUser(Integer userId) {
        if (userId == null) {
            userId = jwtUtils.getUserIdFromContext();
        }
        AppointmentCacheKey cacheKey = new AppointmentCacheKey(userId, AppointmentKeyType.USER_APPOINTMENTS);
        logger.info("Cache lookup for appointments by user ID: {}", userId);
        Integer finalUserId = userId;
        return appointmentListCache.get(cacheKey, k -> {
            logger.info("Cache MISS - Fetching appointments from database for user ID: {}", finalUserId);
            List<AppointmentSummaryResponseDTO> response = appointmentServiceImpl.getAppointmentsByUser(finalUserId);
            logger.debug("Cached appointments for user ID: {}", finalUserId);
            return response;
        });
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentResponseDTO getAppointmentById(Integer appointmentId) {
        AppointmentCacheKey cacheKey = new AppointmentCacheKey(appointmentId, AppointmentKeyType.APPOINTMENT);
        logger.info("Cache lookup for appointment ID: {}", appointmentId);
        return appointmentCache.get(cacheKey, k -> {
            logger.info("Cache MISS - Fetching appointment from database for ID: {}", appointmentId);
            AppointmentResponseDTO response = appointmentServiceImpl.getAppointmentById(appointmentId);
            logger.debug("Cached appointment for ID: {}", appointmentId);
            return response;
        });
    }



    @Override
    public void updateAppointmentStatus(Integer appointmentId, String status, String cancellationReason) {
        // Retrieve the appointment details before invalidating the cache
        AppointmentResponseDTO appointment = getAppointmentById(appointmentId);

        // Update the appointment status in the service implementation
        appointmentServiceImpl.updateAppointmentStatus(appointmentId, status, cancellationReason);

        // Invalidate all relevant caches
        AppointmentCacheKey appointmentKey = new AppointmentCacheKey(appointmentId, AppointmentKeyType.APPOINTMENT);
        appointmentCache.invalidate(appointmentKey);

        if (appointment != null) {
            // Invalidate the old status cache
            appointmentListCache.invalidate(new AppointmentCacheKey(appointment.getStatus(), AppointmentKeyType.ADMIN_STATUS_APPOINTMENTS));
            // Invalidate the new status cache
            appointmentListCache.invalidate(new AppointmentCacheKey(status, AppointmentKeyType.ADMIN_STATUS_APPOINTMENTS));
            // Invalidate user and admin caches
            invalidateUserAndAdminCaches(appointment.getUserId(), appointment.getAdminId());
        }

        logger.info("Updated appointment status and invalidated related caches for appointmentId: {}", appointmentId);
    }
    @Override
    @Transactional
    public void cancelAppointment(Integer appointmentId, String cancellationReason) {
        appointmentServiceImpl.cancelAppointment(appointmentId, cancellationReason);
        AppointmentCacheKey cacheKey = new AppointmentCacheKey(appointmentId, AppointmentKeyType.APPOINTMENT);
        appointmentCache.invalidate(cacheKey);

        AppointmentResponseDTO appointment = appointmentCache.getIfPresent(cacheKey);
        if (appointment != null) {
            invalidateUserAndAdminCaches(appointment.getUserId(), appointment.getAdminId());
        }

        logger.info("Invalidated caches for appointment ID: {} and relevant caches after cancellation", appointmentId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AppointmentSummaryResponseDTO> getAppointmentsByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        logger.info("Fetching appointments between dates: {} and {}", startDate, endDate);
        return appointmentServiceImpl.getAppointmentsByDateRange(startDate, endDate,pageable);
    }

    @Override
    public Page<AppointmentSummaryResponseDTO> getAppointmentsForAdmin(AppointmentTimeFilter timeFilter,AppointmentStatus appointmentStatus, Pageable pageable,Integer userId,Integer adminId) {
        return appointmentServiceImpl.getAppointmentsForAdmin(timeFilter,appointmentStatus,pageable,userId,adminId );
    }

    public void logCacheStats() {
        logger.info("=== Appointment Cache Statistics ===");

        CacheUtils.logCacheStats(appointmentCache,"Appointment Cache");
        CacheUtils.logCacheStats(appointmentListCache,"Appointment List Cache");
    }

}