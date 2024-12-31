package com.dbms.mentalhealth.util.Etags;

import com.dbms.mentalhealth.dto.Admin.response.AdminProfileResponseDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileSummaryResponseDTO;
import com.dbms.mentalhealth.dto.Admin.response.FullAdminProfileResponseDTO;
import org.springframework.stereotype.Component;

import java.time.ZoneOffset;
import java.util.List;

@Component
public class AdminETagGenerator {
    private static final String PROFILE_TAG_FORMAT = "admin-%d-%d-%s"; // adminId-timestamp-contentHash
    private static final String LIST_TAG_FORMAT = "admin-list-%d-%d"; // size-hash
    private static final String FULL_PROFILE_TAG_FORMAT = "admin-full-%d-%d-%s"; // adminId-timestamp-contentHash

    public String generateProfileETag(AdminProfileResponseDTO adminProfile) {
        String contentFingerprint = String.format("%d-%d-%s-%s-%s-%s-%s-%s",
                adminProfile.getAdminId(),
                adminProfile.getUserId(),
                adminProfile.getFullName(),
                adminProfile.getAdminNotes(),
                adminProfile.getQualifications(),
                adminProfile.getContactNumber(),
                adminProfile.getEmail(),
                adminProfile.getProfilePictureUrl()
        );

        return String.format(PROFILE_TAG_FORMAT,
                adminProfile.getAdminId(),
                adminProfile.getUpdatedAt().toEpochSecond(ZoneOffset.UTC),
                String.valueOf(contentFingerprint.hashCode())
        );
    }

    public String generateFullProfileETag(FullAdminProfileResponseDTO adminProfile) {
        String contentFingerprint = String.format("%d-%d-%s-%s-%s-%s-%s-%s-%d-%d-%d-%s-%d-%d",
                adminProfile.getAdminId(),
                adminProfile.getUserId(),
                adminProfile.getFullName(),
                adminProfile.getAdminNotes(),
                adminProfile.getQualifications(),
                adminProfile.getContactNumber(),
                adminProfile.getEmail(),
                adminProfile.getProfilePictureUrl(),
                adminProfile.getTotalAppointments(),
                adminProfile.getTotalBlogsPublished(),
                adminProfile.getTotalLikesReceived(),
                adminProfile.getLastAppointmentDate(),
                adminProfile.getTotalViewsReceived(),
                adminProfile.getCreatedAt().toEpochSecond(ZoneOffset.UTC)
        );

        return String.format(FULL_PROFILE_TAG_FORMAT,
                adminProfile.getAdminId(),
                adminProfile.getUpdatedAt().toEpochSecond(ZoneOffset.UTC),
                String.valueOf(contentFingerprint.hashCode())
        );
    }

    public String generateListETag(List<AdminProfileSummaryResponseDTO> adminList) {
        String contentFingerprint = adminList.stream()
                .map(admin -> String.format("%d-%s-%s-%s",
                        admin.getAdminId(),
                        admin.getFullName(),
                        admin.getAdminNotes(),
                        admin.getContactNumber()))
                .sorted()
                .reduce("", String::concat);

        return String.format(LIST_TAG_FORMAT,
                adminList.size(),
                contentFingerprint.hashCode()
        );
    }
}