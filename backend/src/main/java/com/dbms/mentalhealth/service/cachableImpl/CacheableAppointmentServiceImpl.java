package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.Appointment.request.AppointmentRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import com.dbms.mentalhealth.service.AppointmentService;
import com.dbms.mentalhealth.service.impl.AppointmentServiceImpl;
import com.github.benmanes.caffeine.cache.Cache;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.logging.Logger;

@Service
@Primary
public class CacheableAppointmentServiceImpl implements AppointmentService {

    private final AppointmentServiceImpl appointmentServiceImpl;
    private final Cache<Integer, AppointmentResponseDTO> appointmentCache;
    private final Cache<Integer, List<AppointmentSummaryResponseDTO>> appointmentListCache;
    private static final Logger logger = Logger.getLogger(CacheableAppointmentServiceImpl.class.getName());

    public CacheableAppointmentServiceImpl(AppointmentServiceImpl appointmentServiceImpl, Cache<Integer, AppointmentResponseDTO> appointmentCache, Cache<Integer, List<AppointmentSummaryResponseDTO>> appointmentListCache) {
        this.appointmentServiceImpl = appointmentServiceImpl;
        this.appointmentCache = appointmentCache;
        this.appointmentListCache = appointmentListCache;
        logger.info("CacheableAppointmentServiceImpl initialized with cache stats enabled");
    }

    @Override
    @Transactional
    public AppointmentResponseDTO createAppointment(AppointmentRequestDTO appointmentRequestDTO) {
        AppointmentResponseDTO response = appointmentServiceImpl.createAppointment(appointmentRequestDTO);
        appointmentCache.put(response.getAppointmentId(), response);
        appointmentListCache.invalidateAll(); // Invalidate list cache to ensure consistency
        logger.info("Added new appointment to cache and invalidated list cache after appointment creation");
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentSummaryResponseDTO> getAppointmentsByUser(Integer userId) {
        logger.info("Cache lookup for appointments by user ID: " + userId);
        List<AppointmentSummaryResponseDTO> cachedAppointments = appointmentListCache.getIfPresent(userId);

        if (cachedAppointments != null) {
            logger.info("Cache HIT - Returning cached appointments for user ID: " + userId);
            return cachedAppointments;
        }

        logger.info("Cache MISS - Fetching appointments from database for user ID: " + userId);
        List<AppointmentSummaryResponseDTO> response = appointmentServiceImpl.getAppointmentsByUser(userId);
        appointmentListCache.put(userId, response);
        logger.info("Cached appointments for user ID: " + userId);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentSummaryResponseDTO> getAppointmentsByAdmin(Integer userId, Integer adminId) {
        int cacheKey = Objects.hash(userId, adminId);
        logger.info("Cache lookup for appointments by admin with key: " + cacheKey);

        List<AppointmentSummaryResponseDTO> cachedAppointments = appointmentListCache.getIfPresent(cacheKey);
        if (cachedAppointments != null) {
            logger.info("Cache HIT - Returning cached appointments for key: " + cacheKey);
            return cachedAppointments;
        }

        logger.info("Cache MISS - Fetching appointments from database for key: " + cacheKey);
        List<AppointmentSummaryResponseDTO> response = appointmentServiceImpl.getAppointmentsByAdmin(userId, adminId);
        appointmentListCache.put(cacheKey, response);
        logger.info("Cached appointments for key: " + cacheKey);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentResponseDTO getAppointmentById(Integer appointmentId) {
        logger.info("Cache lookup for appointment ID: " + appointmentId);
        AppointmentResponseDTO cachedAppointment = appointmentCache.getIfPresent(appointmentId);

        if (cachedAppointment != null) {
            logger.info("Cache HIT - Returning cached appointment for ID: " + appointmentId);
            return cachedAppointment;
        }

        logger.info("Cache MISS - Fetching appointment from database for ID: " + appointmentId);
        AppointmentResponseDTO response = appointmentServiceImpl.getAppointmentById(appointmentId);
        appointmentCache.put(appointmentId, response);
        logger.info("Cached appointment for ID: " + appointmentId);

        return response;
    }

    @Override
    @Transactional
    public void updateAppointmentStatus(Integer appointmentId, String status, String cancellationReason) {
        appointmentServiceImpl.updateAppointmentStatus(appointmentId, status, cancellationReason);
        appointmentCache.invalidate(appointmentId);
        appointmentListCache.invalidateAll();
        logger.info("Invalidated cache for appointment ID: " + appointmentId + " and all appointment lists after status update");
    }

    @Override
    @Transactional
    public void cancelAppointment(Integer appointmentId, String cancellationReason) {
        appointmentServiceImpl.cancelAppointment(appointmentId, cancellationReason);
        appointmentCache.invalidate(appointmentId);
        appointmentListCache.invalidateAll();
        logger.info("Invalidated cache for appointment ID: " + appointmentId + " and all appointment lists after cancellation");
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentSummaryResponseDTO> getAppointmentsByDateRange(LocalDate startDate, LocalDate endDate) {
        int cacheKey = Objects.hash(startDate, endDate);
        logger.info("Cache lookup for appointments by date range with key: " + cacheKey);

        List<AppointmentSummaryResponseDTO> cachedAppointments = appointmentListCache.getIfPresent(cacheKey);
        if (cachedAppointments != null) {
            logger.info("Cache HIT - Returning cached appointments for key: " + cacheKey);
            return cachedAppointments;
        }

        logger.info("Cache MISS - Fetching appointments from database for key: " + cacheKey);
        List<AppointmentSummaryResponseDTO> response = appointmentServiceImpl.getAppointmentsByDateRange(startDate, endDate);
        appointmentListCache.put(cacheKey, response);
        logger.info("Cached appointments for key: " + cacheKey);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentSummaryResponseDTO> getUpcomingAppointmentsForAdmin() {
        int cacheKey = "upcoming_admin".hashCode();
        logger.info("Cache lookup for upcoming appointments for admin with key: " + cacheKey);

        List<AppointmentSummaryResponseDTO> cachedAppointments = appointmentListCache.getIfPresent(cacheKey);
        if (cachedAppointments != null) {
            logger.info("Cache HIT - Returning cached upcoming appointments for admin");
            return cachedAppointments;
        }

        logger.info("Cache MISS - Fetching upcoming appointments from database for admin");
        List<AppointmentSummaryResponseDTO> response = appointmentServiceImpl.getUpcomingAppointmentsForAdmin();
        appointmentListCache.put(cacheKey, response);
        logger.info("Cached upcoming appointments for admin");

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentSummaryResponseDTO> getAppointmentsByAdminStatus(String status) {
        int cacheKey = status.hashCode();
        logger.info("Cache lookup for appointments by admin status with key: " + cacheKey);

        List<AppointmentSummaryResponseDTO> cachedAppointments = appointmentListCache.getIfPresent(cacheKey);
        if (cachedAppointments != null) {
            logger.info("Cache HIT - Returning cached appointments for status: " + status);
            return cachedAppointments;
        }

        logger.info("Cache MISS - Fetching appointments from database for status: " + status);
        List<AppointmentSummaryResponseDTO> response = appointmentServiceImpl.getAppointmentsByAdminStatus(status);
        appointmentListCache.put(cacheKey, response);
        logger.info("Cached appointments for status: " + status);

        return response;
    }
}