package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.Admin.request.AdminProfileRequestDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileResponseDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileSummaryResponseDTO;
import com.dbms.mentalhealth.dto.Admin.response.FullAdminProfileResponseDTO;
import com.dbms.mentalhealth.service.AdminService;
import com.dbms.mentalhealth.urlMapper.AdminUrlMapping;
import com.dbms.mentalhealth.util.Etags.AdminETagGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

@RestController
public class AdminController {

    private final AdminService adminService;
    private final AdminETagGenerator eTagGenerator;

    @Autowired
    public AdminController(AdminService adminService, AdminETagGenerator eTagGenerator) {
        this.adminService = Objects.requireNonNull(adminService, "adminService cannot be null");
        this.eTagGenerator = Objects.requireNonNull(eTagGenerator, "eTagGenerator cannot be null");
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping(AdminUrlMapping.CREATE_ADMIN_PROFILE)
    public ResponseEntity<AdminProfileResponseDTO> createAdminProfile(
            @RequestPart("adminProfile") AdminProfileRequestDTO adminProfileRequestDTO,
            @RequestPart("profilePicture") MultipartFile profilePicture) throws Exception {
        if (adminProfileRequestDTO == null || profilePicture == null || profilePicture.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        AdminProfileResponseDTO responseDTO = adminService.createAdminProfile(adminProfileRequestDTO, profilePicture);
        String eTag = eTagGenerator.generateProfileETag(responseDTO);

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(responseDTO);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(AdminUrlMapping.GET_ADMIN_PROFILE)
    public ResponseEntity<FullAdminProfileResponseDTO> getAdminProfile(
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestParam(value = "adminId", required = false) Integer adminId,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {

        FullAdminProfileResponseDTO adminProfile = adminService.getAdminProfile(userId, adminId);
        String eTag = eTagGenerator.generateFullProfileETag(adminProfile);

        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(adminProfile);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(AdminUrlMapping.UPDATE_ADMIN_PROFILE)
    public ResponseEntity<AdminProfileResponseDTO> updateAdminProfile(
            @RequestPart("adminProfile") AdminProfileRequestDTO adminProfileRequestDTO,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) throws Exception {
        if (adminProfileRequestDTO == null) {
            return ResponseEntity.badRequest().build();
        }

        AdminProfileResponseDTO responseDTO = adminService.updateAdminProfile(adminProfileRequestDTO, profilePicture);
        String eTag = eTagGenerator.generateProfileETag(responseDTO);

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(responseDTO);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(AdminUrlMapping.GET_ALL_ADMINS)
    public ResponseEntity<List<AdminProfileSummaryResponseDTO>> getAllAdmins(
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {

        List<AdminProfileSummaryResponseDTO> responseDTO = adminService.getAllAdmins();
        if (responseDTO == null || responseDTO.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        String eTag = eTagGenerator.generateListETag(responseDTO);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(responseDTO);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping(AdminUrlMapping.DELETE_ADMIN_PROFILE)
    public ResponseEntity<Void> deleteAdminProfile(@PathVariable Integer adminId) {
        if (adminId == null) {
            return ResponseEntity.badRequest().build();
        }

        adminService.deleteAdminProfile(adminId);
        return ResponseEntity.noContent().build();
    }
}