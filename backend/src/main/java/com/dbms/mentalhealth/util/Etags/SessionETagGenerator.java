package com.dbms.mentalhealth.util.Etags;

import com.dbms.mentalhealth.dto.session.SessionResponseDTO;
import com.dbms.mentalhealth.dto.session.SessionSummaryDTO;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Generates ETags for session resources to support caching and conditional requests.
 * ETags are unique identifiers that change when the resource content changes.
 */
@Component
public class SessionETagGenerator {
    private static final String SESSION_TAG_FORMAT = "session-%d-%s-%d-%d"; // sessionId-status-userId-listenerId
    private static final String LIST_TAG_FORMAT = "session-list-%d-%d"; // size-hash

    /**
     * Generates an ETag for a single session.
     * @param session The session to generate an ETag for
     * @return A unique ETag string for the session
     * @throws IllegalArgumentException if session is null or has null required fields
     */
    public String generateSessionETag(SessionResponseDTO session) {
        validateSession(session);

        return String.format(SESSION_TAG_FORMAT,
                session.getSessionId(),
                session.getSessionStatus(),
                session.getUserId(),
                session.getListenerId()
        );
    }

    /**
     * Generates an ETag for a list of sessions.
     * @param sessionList The list of sessions to generate an ETag for
     * @return A unique ETag string for the list of sessions
     * @throws IllegalArgumentException if sessionList is null
     */
    public String generateListETag(List<SessionSummaryDTO> sessionList) {
        if (sessionList == null) {
            throw new IllegalArgumentException("Session list cannot be null");
        }

        String contentFingerprint = sessionList.stream()
                .filter(Objects::nonNull)
                .map(this::generateSessionFingerprint)
                .sorted()
                .collect(Collectors.joining());

        int contentHash = Objects.hash(contentFingerprint);

        return String.format(LIST_TAG_FORMAT,
                sessionList.size(),
                contentHash
        );
    }

    /**
     * Generates a fingerprint string for a single session summary.
     */
    private String generateSessionFingerprint(SessionSummaryDTO session) {
        return String.format("%d-%s-%d-%d",
                session.getSessionId(),
                session.getSessionStatus(),
                session.getUserId(),
                session.getListenerId()
        );
    }

    /**
     * Validates that a session and its required fields are not null.
     */
    private void validateSession(SessionResponseDTO session) {
        if (session == null) {
            throw new IllegalArgumentException("Session cannot be null");
        }
        if (session.getSessionId() == null) {
            throw new IllegalArgumentException("Session ID cannot be null");
        }
        if (session.getSessionStatus() == null) {
            throw new IllegalArgumentException("Session status cannot be null");
        }
        if (session.getUserId() == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (session.getListenerId() == null) {
            throw new IllegalArgumentException("Listener ID cannot be null");
        }
    }
}