package com.dbms.mentalhealth.util.Etags;

import com.dbms.mentalhealth.dto.EmergencyHelpline.EmergencyHelplineDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Generates ETags for emergency helpline resources to support caching and conditional requests.
 * ETags are unique identifiers that change when the resource content changes.
 */
@Component
public class EmergencyHelplineETagGenerator {
    private static final String HELPLINE_TAG_FORMAT = "helpline-%s-%s-%s-%s-%d"; // name-phoneNumber-countryCode-emergencyType-priority
    private static final String LIST_TAG_FORMAT = "helpline-list-%d-%d"; // size-hash

    /**
     * Generates an ETag for a single emergency helpline.
     */
    public String generateHelplineETag(EmergencyHelplineDTO helpline) {
        validateHelpline(helpline);

        // Create a string containing all relevant helpline data
        String helplineData = String.format("%s-%s-%s-%s-%d",
                nullSafe(helpline.getName()),
                nullSafe(helpline.getPhoneNumber()),
                nullSafe(helpline.getCountryCode()),
                nullSafe(helpline.getEmergencyType()),
                helpline.getPriority()
        );

        // Generate a hash of the helpline data
        int contentHash = Objects.hash(helplineData);
        return String.format(HELPLINE_TAG_FORMAT,
                nullSafe(helpline.getName()),
                nullSafe(helpline.getPhoneNumber()),
                nullSafe(helpline.getCountryCode()),
                nullSafe(helpline.getEmergencyType()),
                helpline.getPriority()
        );
    }

    /**
     * Generates an ETag for a list of emergency helplines.
     */
    public String generateHelplineETag(Iterable<EmergencyHelplineDTO> helplines) {
        if (helplines == null) {
            throw new IllegalArgumentException("Helpline list cannot be null");
        }

        String contentFingerprint = StreamSupport.stream(helplines.spliterator(), false)
                .filter(Objects::nonNull)
                .map(this::generateHelplineFingerprint)
                .sorted()
                .collect(Collectors.joining());

        int contentHash = Objects.hash(contentFingerprint);

        return String.format(LIST_TAG_FORMAT, StreamSupport.stream(helplines.spliterator(), false).count(), contentHash);
    }

    private String generateHelplineFingerprint(EmergencyHelplineDTO helpline) {
        if (helpline == null) {
            throw new IllegalArgumentException("Helpline cannot be null when generating fingerprint");
        }

        return String.format("%s-%s-%s-%s-%d",
                nullSafe(helpline.getName()),
                nullSafe(helpline.getPhoneNumber()),
                nullSafe(helpline.getCountryCode()),
                nullSafe(helpline.getEmergencyType()),
                helpline.getPriority()
        );
    }

    private void validateHelpline(EmergencyHelplineDTO helpline) {
        if (helpline == null) {
            throw new IllegalArgumentException("Helpline cannot be null");
        }
        if (helpline.getName() == null) {
            throw new IllegalArgumentException("Helpline name cannot be null");
        }
        if (helpline.getPhoneNumber() == null) {
            throw new IllegalArgumentException("Helpline phone number cannot be null");
        }
        if (helpline.getCountryCode() == null) {
            throw new IllegalArgumentException("Helpline country code cannot be null");
        }
        if (helpline.getEmergencyType() == null) {
            throw new IllegalArgumentException("Helpline emergency type cannot be null");
        }
        if (helpline.getPriority() == null) {
            throw new IllegalArgumentException("Helpline priority cannot be null");
        }
    }

    private String nullSafe(String value) {
        return value != null ? value : "null";
    }
}