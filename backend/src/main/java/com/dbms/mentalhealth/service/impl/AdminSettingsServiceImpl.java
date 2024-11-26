package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.adminSettings.request.AdminSettingsRequestDTO;
import com.dbms.mentalhealth.dto.adminSettings.response.AdminSettingsResponseDTO;
import com.dbms.mentalhealth.exception.AdminSettingAlreadyExistsException;
import com.dbms.mentalhealth.exception.AdminSettingNotFoundException;
import com.dbms.mentalhealth.mapper.AdminSettingsMapper;
import com.dbms.mentalhealth.model.Admin;
import com.dbms.mentalhealth.model.AdminSettings;
import com.dbms.mentalhealth.repository.AdminRepository;
import com.dbms.mentalhealth.repository.AdminSettingsRepository;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.AdminSettingsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
public class AdminSettingsServiceImpl implements AdminSettingsService {

    private final AdminSettingsRepository adminSettingsRepository;
    private final AdminSettingsMapper adminSettingsMapper;
    private final JwtUtils jwtUtils;
    private final AdminRepository adminRepository;

    @Autowired
    public AdminSettingsServiceImpl(AdminSettingsRepository adminSettingsRepository, AdminSettingsMapper adminSettingsMapper, JwtUtils jwtUtils, AdminRepository adminRepository) {
        this.adminSettingsRepository = adminSettingsRepository;
        this.adminSettingsMapper = adminSettingsMapper;
        this.jwtUtils = jwtUtils;
        this.adminRepository = adminRepository;
    }

    @Override
    public AdminSettingsResponseDTO createAdminSettings(AdminSettingsRequestDTO adminSettingsRequestDTO) {
        Integer userId = getUserIdFromContext();
        Admin admin = adminRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));
        Integer adminId = admin.getAdminId();

        if (adminSettingsRepository.existsByAdmin_AdminId(adminId)) {
            throw new AdminSettingAlreadyExistsException("Setting already exists for this admin");
        }

        AdminSettings adminSettings = adminSettingsMapper.toEntity(adminSettingsRequestDTO);
        adminSettings.setAdmin(admin);
        AdminSettings savedAdminSettings = adminSettingsRepository.save(adminSettings);
        return adminSettingsMapper.toResponseDTO(savedAdminSettings);
    }

    @Override
    public AdminSettingsResponseDTO updateAdminSettings(AdminSettingsRequestDTO adminSettingsRequestDTO) {
        Integer userId = getUserIdFromContext();
        Admin admin = adminRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));
        Integer adminId = admin.getAdminId();

        AdminSettings adminSettings = adminSettingsRepository.findByAdmin_AdminId(adminId);
        if (adminSettings == null) {
            throw new AdminSettingNotFoundException("Setting does not exist for this admin");
        }

        adminSettings.setIsCounsellor(adminSettingsRequestDTO.getIsCounsellor());
        adminSettings.setMaxAppointmentsPerDay(adminSettingsRequestDTO.getMaxAppointmentsPerDay());
        adminSettings.setDefaultTimeSlotDuration(adminSettingsRequestDTO.getDefaultTimeSlotDuration());
        AdminSettings savedAdminSettings = adminSettingsRepository.save(adminSettings);
        return adminSettingsMapper.toResponseDTO(savedAdminSettings);
    }

    @Override
    public void deleteAdminSettings() {
        Integer userId = getUserIdFromContext();
        Admin admin = adminRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));
        Integer adminId = admin.getAdminId();

        AdminSettings adminSettings = adminSettingsRepository.findByAdmin_AdminId(adminId);
        if (adminSettings == null) {
            throw new AdminSettingNotFoundException("Setting does not exist for this admin");
        }
        adminSettingsRepository.delete(adminSettings);
    }

    @Override
    public AdminSettingsResponseDTO getAdminSettings() {
        Integer userId = getUserIdFromContext();
        Admin admin = adminRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));
        Integer adminId = admin.getAdminId();

        AdminSettings adminSettings = adminSettingsRepository.findByAdmin_AdminId(adminId);
        if (adminSettings == null) {
            throw new AdminSettingNotFoundException("Setting does not exist for this admin");
        }
        return adminSettingsMapper.toResponseDTO(adminSettings);
    }

    // Method to extract user ID from the context
    private Integer getUserIdFromContext() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String jwt = jwtUtils.getJwtFromHeader(request);
        return jwtUtils.getUserIdFromJwtToken(jwt);
    }
}