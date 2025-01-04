package com.dbms.mentalhealth.util.Etags;

import com.dbms.mentalhealth.dto.TimeSlot.response.TimeSlotResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Generates ETags for time slot resources to support caching and conditional requests.
 * ETags are unique identifiers that change when the resource content changes.
 */
@Component
public class TimeSlotETagGenerator {
    private static final String LIST_TAG_FORMAT = "time-slot-list-%d-%d"; // size-hash
    private static final String PAGE_TAG_FORMAT = "time-slot-page-%d-%d-%d-%s-%d"; // pageNumber-pageSize-totalElements-sort-hash


    /**
     * Generates an ETag for a list of time slots.
     * @param timeSlotList The list of time slots to generate an ETag for
     * @return A unique ETag string for the list of time slots
     * @throws IllegalArgumentException if timeSlotList is null
     */
    public String generateListETag(List<TimeSlotResponseDTO> timeSlotList) {
        if (timeSlotList == null) {
            throw new IllegalArgumentException("Time slot list cannot be null");
        }

        String contentFingerprint = timeSlotList.stream()
                .filter(Objects::nonNull)
                .map(this::generateTimeSlotFingerprint)
                .sorted()
                .collect(Collectors.joining());

        int contentHash = Objects.hash(contentFingerprint);

        return String.format(LIST_TAG_FORMAT,
                timeSlotList.size(),
                contentHash
        );
    }

    /**
     * Generates an ETag for a paginated response of time slots.
     * @param timeSlotPage The page of time slots to generate an ETag for
     * @return A unique ETag string for the page of time slots
     * @throws IllegalArgumentException if timeSlotPage is null
     */
    public String generatePageETag(Page<TimeSlotResponseDTO> timeSlotPage) {
        if (timeSlotPage == null) {
            throw new IllegalArgumentException("Time slot page cannot be null");
        }

        String contentFingerprint = timeSlotPage.getContent().stream()
                .filter(Objects::nonNull)
                .map(this::generateTimeSlotFingerprint)
                .sorted()
                .collect(Collectors.joining());

        // Include sort information in the fingerprint
        String sortFingerprint = timeSlotPage.getSort().stream()
                .map(order -> order.getProperty() + order.getDirection())
                .collect(Collectors.joining(","));

        int contentHash = Objects.hash(contentFingerprint);

        return String.format(PAGE_TAG_FORMAT,
                timeSlotPage.getNumber(),           // current page number
                timeSlotPage.getSize(),             // page size
                timeSlotPage.getTotalElements(),     // total number of elements
                sortFingerprint,                       // sorting information
                contentHash                            // content hash
        );
    }

    /**
     * Generates a fingerprint string for a single time slot.
     */
    private String generateTimeSlotFingerprint(TimeSlotResponseDTO timeSlot) {
        return String.format("%d-%s-%s-%s-%s",
                timeSlot.getTimeSlotId(),
                timeSlot.getDate(),
                timeSlot.getStartTime(),
                timeSlot.getEndTime(),
                timeSlot.getIsAvailable()
        );
    }

    /**
     * Validates that a time slot and its required fields are not null.
     */
    private void validateTimeSlot(TimeSlotResponseDTO timeSlot) {
        if (timeSlot == null) {
            throw new IllegalArgumentException("Time slot cannot be null");
        }
        if (timeSlot.getTimeSlotId() == null) {
            throw new IllegalArgumentException("Time slot ID cannot be null");
        }
        if (timeSlot.getDate() == null) {
            throw new IllegalArgumentException("Date cannot be null");
        }
        if (timeSlot.getStartTime() == null) {
            throw new IllegalArgumentException("Start time cannot be null");
        }
    }
}