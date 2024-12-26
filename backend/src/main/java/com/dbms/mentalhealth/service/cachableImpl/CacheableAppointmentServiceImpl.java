package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.Appointment.request.AppointmentRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.AppointmentService;
import com.dbms.mentalhealth.service.impl.AppointmentServiceImpl;
import com.github.benmanes.caffeine.cache.Cache;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
@Primary
public class CacheableAppointmentServiceImpl implements AppointmentService {

    private static final String APPOINTMENT_PREFIX = "appointment";
    private static final String USER_APPOINTMENTS_PREFIX = "userAppointments";
    private static final String ADMIN_APPOINTMENTS_PREFIX = "adminAppointments";
    private static final String DATE_RANGE_APPOINTMENTS_PREFIX = "dateRangeAppointments";
    private static final String UPCOMING_ADMIN_APPOINTMENTS_PREFIX = "upcomingAdminAppointments";
    private static final String ADMIN_STATUS_APPOINTMENTS_PREFIX = "adminStatusAppointments";

    private final AppointmentServiceImpl appointmentServiceImpl;
    private final Cache<String, AppointmentResponseDTO> appointmentCache;
    private final Cache<String, List<AppointmentSummaryResponseDTO>> appointmentListCache;
    private static final Logger logger = LoggerFactory.getLogger(CacheableAppointmentServiceImpl.class);
    private final JwtUtils jwtUtils;

    public CacheableAppointmentServiceImpl(AppointmentServiceImpl appointmentServiceImpl,
                                           Cache<String, AppointmentResponseDTO> appointmentCache,
                                           Cache<String, List<AppointmentSummaryResponseDTO>> appointmentListCache,
                                           JwtUtils jwtUtils) {
        this.appointmentServiceImpl = appointmentServiceImpl;
        this.appointmentCache = appointmentCache;
        this.appointmentListCache = appointmentListCache;
        this.jwtUtils = jwtUtils;
        logger.info("CacheableAppointmentServiceImpl initialized with cache stats enabled");
    }

    private String generateCacheKey(String prefix, Object... parts) {
        return prefix + ":" + String.join(":", Arrays.stream(parts)
                .filter(Objects::nonNull)
                .map(Object::toString)
                .toList());
    }

    private void invalidateUserAndAdminCaches(Integer userId, Integer adminId) {
        appointmentListCache.invalidate(generateCacheKey(USER_APPOINTMENTS_PREFIX, userId));
        appointmentListCache.invalidate(generateCacheKey(ADMIN_APPOINTMENTS_PREFIX, userId, adminId));

    }


    @Override
    @Transactional
    public AppointmentResponseDTO createAppointment(AppointmentRequestDTO appointmentRequestDTO) {
        Integer userId = jwtUtils.getUserIdFromContext();
        AppointmentResponseDTO response = appointmentServiceImpl.createAppointment(appointmentRequestDTO);
        appointmentCache.put(generateCacheKey(APPOINTMENT_PREFIX, response.getAppointmentId()), response);
        invalidateUserAndAdminCaches(userId, appointmentRequestDTO.getAdminId());
        logger.info("Added new appointment to cache and invalidated relevant caches after appointment creation");
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentSummaryResponseDTO> getAppointmentsByUser(Integer userId) {
        String cacheKey = generateCacheKey(USER_APPOINTMENTS_PREFIX, userId);
        logger.info("Cache lookup for appointments by user ID: {}", userId);
        return appointmentListCache.get(cacheKey, k -> {
            logger.info("Cache MISS - Fetching appointments from database for user ID: {}", userId);
            List<AppointmentSummaryResponseDTO> response = appointmentServiceImpl.getAppointmentsByUser(userId);
            logger.debug("Cached appointments for user ID: {}", userId);
            return response;
        });
    }

    @Override
    public List<AppointmentSummaryResponseDTO> getAppointmentsByAdmin(Integer userId, Integer adminId) {
        if (userId == null && adminId == null) {
            userId = jwtUtils.getUserIdFromContext();
        }

        String cacheKey = generateCacheKey(ADMIN_APPOINTMENTS_PREFIX, userId, adminId);

        Integer finalUserId = userId;
        return appointmentListCache.get(cacheKey, k -> {
            logger.info("Cache MISS - Fetching appointments from database for key: {}", cacheKey);
            return appointmentServiceImpl.getAppointmentsByAdmin(finalUserId, adminId);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentResponseDTO getAppointmentById(Integer appointmentId) {
        String cacheKey = generateCacheKey(APPOINTMENT_PREFIX, appointmentId);
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
        AppointmentResponseDTO appointment = getAppointmentById(appointmentId);
        appointmentServiceImpl.updateAppointmentStatus(appointmentId, status, cancellationReason);
        String cacheKey = generateCacheKey(APPOINTMENT_PREFIX, appointmentId);
        appointmentCache.invalidate(cacheKey);

        if (appointment != null) {
            invalidateUserAndAdminCaches(appointment.getUserId(), appointment.getAdminId());
            appointmentListCache.invalidate(generateCacheKey(ADMIN_STATUS_APPOINTMENTS_PREFIX, status));
        }
    }

    @Override
    @Transactional
    public void cancelAppointment(Integer appointmentId, String cancellationReason) {
        appointmentServiceImpl.cancelAppointment(appointmentId, cancellationReason);
        String cacheKey = generateCacheKey(APPOINTMENT_PREFIX, appointmentId);
        appointmentCache.invalidate(cacheKey);

        AppointmentResponseDTO appointment = appointmentCache.getIfPresent(cacheKey);
        if (appointment != null) {
            invalidateUserAndAdminCaches(appointment.getUserId(), appointment.getAdminId());
        }

        logger.info("Invalidated caches for appointment ID: {} and relevant caches after cancellation", appointmentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentSummaryResponseDTO> getAppointmentsByDateRange(LocalDate startDate, LocalDate endDate) {
        logger.info("Fetching appointments between dates: {} and {}", startDate, endDate);
        return appointmentServiceImpl.getAppointmentsByDateRange(startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentSummaryResponseDTO> getUpcomingAppointmentsForAdmin() {
        logger.info("Fetching upcoming appointments for admin");
        return appointmentServiceImpl.getUpcomingAppointmentsForAdmin();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentSummaryResponseDTO> getAppointmentsByAdminStatus(String status) {
        logger.info("Fetching appointments by admin status: {}", status);
        return appointmentServiceImpl.getAppointmentsByAdminStatus(status);
    }

    public void logCacheStats() {
        logger.info("Appointment Cache Stats: {}", appointmentCache.stats());
        logger.info("Appointment List Cache Stats: {}", appointmentListCache.stats());
    }
}