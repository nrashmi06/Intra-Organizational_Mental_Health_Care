package com.dbms.mentalhealth.util.Etags;

import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationResponseDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationSummaryResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Generates ETags for listener application resources to support caching and conditional requests.
 * ETags are unique identifiers that change when the resource content changes.
 */
@Component
public class ListenerApplicationETagGenerator {
    private static final String APPLICATION_TAG_FORMAT = "application-%d"; // contentHash
    private static final String LIST_TAG_FORMAT = "application-list-%d-%d"; // size-hash
    private static final String PAGE_TAG_FORMAT = "application-page-%d-%d-%d-%d"; // pageNumber-pageSize-totalElements-contentHash

    /**
     * Generates an ETag for a single listener application.
     *
     * @param application The application to generate an ETag for
     * @return A properly formatted ETag string
     * @throws IllegalArgumentException if the application or required fields are null
     */
    public String generateApplicationETag(ListenerApplicationResponseDTO application) {
        validateApplication(application);

        // Create a string containing all relevant application data
        String applicationData = String.format("%d-%s-%s-%s-%s-%s-%d-%s-%s",
                application.getApplicationId(),
                nullSafe(application.getUsn()),
                nullSafe(String.valueOf(application.getApplicationStatus())),
                nullSafe(application.getFullName()),
                nullSafe(application.getBranch()),
                nullSafe(application.getCertificateUrl()),
                application.getSemester(),
                nullSafe(application.getReasonForApplying()),
                nullSafe(application.getPhoneNumber())
        );

        // Generate a hash of the application data
        int contentHash = Objects.hash(applicationData);
        return String.format(APPLICATION_TAG_FORMAT, contentHash);
    }

    public String generatePageETag(Page<ListenerApplicationSummaryResponseDTO> page) {
        if (page == null) {
            throw new IllegalArgumentException("Page cannot be null");
        }

        String contentFingerprint = page.getContent().stream()
                .filter(Objects::nonNull)
                .map(this::generateApplicationFingerprint)
                .sorted()
                .collect(Collectors.joining());

        int contentHash = Objects.hash(contentFingerprint);

        return String.format(PAGE_TAG_FORMAT, page.getNumber(), page.getSize(), page.getTotalElements(), contentHash);
    }
    public String generateListETag(Iterable<ListenerApplicationSummaryResponseDTO> applicationList) {
        if (applicationList == null) {
            throw new IllegalArgumentException("Application list cannot be null");
        }

        String contentFingerprint = StreamSupport.stream(applicationList.spliterator(), false)
                .filter(Objects::nonNull)
                .map(this::generateApplicationFingerprint)
                .sorted()
                .collect(Collectors.joining());

        int contentHash = Objects.hash(contentFingerprint);

        return String.format(LIST_TAG_FORMAT, StreamSupport.stream(applicationList.spliterator(), false).count(), contentHash);
    }

    private String generateApplicationFingerprint(ListenerApplicationSummaryResponseDTO application) {
        if (application == null) {
            throw new IllegalArgumentException("Application cannot be null when generating fingerprint");
        }

        return String.format("%d-%s-%s-%s-%s-%s",
                application.getApplicationId(),
                nullSafe(application.getFullName()),
                nullSafe(application.getBranch()),
                nullSafe(String.valueOf(application.getSemester())),
                nullSafe(String.valueOf(application.getApplicationStatus())),
                nullSafe(application.getCertificateUrl())
        );
    }

    /**
     * Validates that an application and its required fields are not null.
     *
     * @param application The application to validate
     * @throws IllegalArgumentException if the application or required fields are null
     */
    private void validateApplication(ListenerApplicationResponseDTO application) {
        if (application == null) {
            throw new IllegalArgumentException("Application cannot be null");
        }
        if (application.getApplicationId() == null) {
            throw new IllegalArgumentException("Application ID cannot be null");
        }
        if (application.getApplicationStatus() == null) {
            throw new IllegalArgumentException("Application status cannot be null");
        }
        if (application.getUsn() == null) {
            throw new IllegalArgumentException("USN cannot be null");
        }
    }

    /**
     * Helper method to handle null values safely in string formatting.
     *
     * @param value The string value to check
     * @return The original string or "null" if the value is null
     */
    private String nullSafe(String value) {
        return value != null ? value : "null";
    }
}