// EmergencyHelplineETagGenerator.java
package com.dbms.mentalhealth.util.Etags;

import com.dbms.mentalhealth.dto.EmergencyHelpline.EmergencyHelplineDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Generates ETags for emergency helpline resources to support caching and conditional requests.
 * ETags are unique identifiers that change when the resource content changes.
 */
@Component
public class EmergencyHelplineETagGenerator {
    private static final String HELPLINE_TAG_FORMAT = "helpline-%s-%s-%s-%s-%d"; // name-phoneNumber-countryCode-emergencyType-priority

    /**
     * Generates an ETag for a single emergency helpline.
     */
    public String generateHelplineETag(EmergencyHelplineDTO helpline) {
        validateHelpline(helpline);

        return String.format(HELPLINE_TAG_FORMAT,
                helpline.getName(),
                helpline.getPhoneNumber(),
                helpline.getCountryCode(),
                helpline.getEmergencyType(),
                helpline.getPriority()
        );
    }

    /**
     * Generates an ETag for a list of emergency helplines.
     */
    public String generateHelplineETag(List<EmergencyHelplineDTO> helplines) {
        String combinedTags = helplines.stream()
                .map(this::generateHelplineETag)
                .collect(Collectors.joining("-"));
        return String.format("helplines-%s", combinedTags.hashCode());
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
}