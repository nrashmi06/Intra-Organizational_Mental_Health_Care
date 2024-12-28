package com.dbms.mentalhealth.util.Etags;

import com.dbms.mentalhealth.dto.Admin.response.AdminProfileResponseDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileSummaryResponseDTO;
import org.springframework.stereotype.Component;

import java.time.ZoneOffset;
import java.util.List;

@Component
public class AdminETagGenerator {
    private static final String PROFILE_TAG_FORMAT = "admin-%d-%d"; // adminId-timestamp
    private static final String LIST_TAG_FORMAT = "admin-list-%d-%d"; // size-hash

    public String generateProfileETag(AdminProfileResponseDTO adminProfile) {
        return String.format(PROFILE_TAG_FORMAT,
                adminProfile.getAdminId(),
                adminProfile.getUpdatedAt().toEpochSecond(ZoneOffset.UTC)
        );
    }

    public String generateListETag(List<AdminProfileSummaryResponseDTO> adminList) {
        String contentFingerprint = adminList.stream()
                .map(admin -> String.format("%d-%s-%s-%s",
                        admin.getAdminId(),
                        admin.getFullName(),
                        admin.getAdminNotes(),
                        admin.getContactNumber()))
                .sorted()  // Sort to ensure same order always
                .reduce("", String::concat);

        // Use consistent hash of the content
        int contentHash = contentFingerprint.hashCode();

        return String.format(LIST_TAG_FORMAT,
                adminList.size(),
                contentHash
        );
    }
}