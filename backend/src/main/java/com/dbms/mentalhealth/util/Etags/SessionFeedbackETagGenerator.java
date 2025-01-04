package com.dbms.mentalhealth.util.Etags;

import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackResponseDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackSummaryResponseDTO;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class SessionFeedbackETagGenerator {
    private static final String FEEDBACK_TAG_FORMAT = "feedback-%d-%d-%d-%s"; // feedbackId-sessionId-rating-timestamp
    private static final String LIST_TAG_FORMAT = "feedback-list-%d-%d"; // size-hash
    private static final String SUMMARY_TAG_FORMAT = "feedback-summary-%d-%d-%d-%d-%d-%.2f"; // ratings counts and avg

    /**
     * Generates an ETag for a single feedback response.
     */
    public String generateFeedbackETag(SessionFeedbackResponseDTO feedback) {
        validateFeedback(feedback);

        return String.format(FEEDBACK_TAG_FORMAT,
                feedback.getFeedbackId(),
                feedback.getSessionId(),
                feedback.getRating(),
                feedback.getSubmittedAt().toString()
        );
    }

    /**
     * Generates an ETag for a list of feedback responses.
     */
    public String generateListETag(List<SessionFeedbackResponseDTO> feedbackList) {
        if (feedbackList == null) {
            throw new IllegalArgumentException("Feedback list cannot be null");
        }

        String contentFingerprint = feedbackList.stream()
                .filter(Objects::nonNull)
                .map(this::generateFeedbackFingerprint)
                .sorted()
                .collect(Collectors.joining());

        int contentHash = Objects.hash(contentFingerprint);

        return String.format(LIST_TAG_FORMAT,
                feedbackList.size(),
                contentHash
        );
    }

    /**
     * Generates an ETag for feedback summary.
     */
    public String generateSummaryETag(SessionFeedbackSummaryResponseDTO summary) {
        if (summary == null) {
            throw new IllegalArgumentException("Feedback summary cannot be null");
        }

        return String.format(SUMMARY_TAG_FORMAT,
                summary.getRating5(),
                summary.getRating4(),
                summary.getRating3(),
                summary.getRating2(),
                summary.getRating1(),
                summary.getAvgRating().doubleValue()
        );
    }

    /**
     * Generates a fingerprint string for a single feedback.
     */
    private String generateFeedbackFingerprint(SessionFeedbackResponseDTO feedback) {
        return String.format("%d-%d-%d-%d-%s-%s",
                feedback.getFeedbackId(),
                feedback.getSessionId(),
                feedback.getUserId(),
                feedback.getRating(),
                feedback.getComments(),
                feedback.getSubmittedAt().toString()
        );
    }

    /**
     * Validates that a feedback and its required fields are not null.
     */
    private void validateFeedback(SessionFeedbackResponseDTO feedback) {
        if (feedback == null) {
            throw new IllegalArgumentException("Feedback cannot be null");
        }
        if (feedback.getFeedbackId() == null) {
            throw new IllegalArgumentException("Feedback ID cannot be null");
        }
        if (feedback.getSessionId() == null) {
            throw new IllegalArgumentException("Session ID cannot be null");
        }
        if (feedback.getRating() == null) {
            throw new IllegalArgumentException("Rating cannot be null");
        }
        if (feedback.getSubmittedAt() == null) {
            throw new IllegalArgumentException("Submitted timestamp cannot be null");
        }
    }
}