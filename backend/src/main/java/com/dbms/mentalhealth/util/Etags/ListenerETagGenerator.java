package com.dbms.mentalhealth.util.Etags;

import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class ListenerETagGenerator {
    private static final String LISTENER_TAG_FORMAT = "listener-%d-%d-%d-%.2f"; // listenerId-totalSessions-messagesSent-avgRating
    private static final String LIST_TAG_FORMAT = "listener-list-%d-%d"; // size-hash
    private static final String PAGE_TAG_FORMAT = "listener-page-%d-%d"; // size-hash

    public String generateListenerETag(ListenerDetailsResponseDTO listener) {
        validateListener(listener);

        return String.format(LISTENER_TAG_FORMAT,
                listener.getListenerId(),
                listener.getTotalSessions(),
                listener.getTotalMessagesSent(),
                listener.getAverageRating() != null ? listener.getAverageRating() : 0.0
        );
    }

    public String generateListETag(List<UserActivityDTO> listenerList) {
        if (listenerList == null) {
            throw new IllegalArgumentException("Listener list cannot be null");
        }

        String contentFingerprint = listenerList.stream()
                .filter(Objects::nonNull)
                .map(this::generateListenerFingerprint)
                .sorted()
                .collect(Collectors.joining());

        int contentHash = Objects.hash(contentFingerprint);

        return String.format(LIST_TAG_FORMAT,
                listenerList.size(),
                contentHash
        );
    }

    public String generatePageETag(Page<UserActivityDTO> listenerPage) {
        if (listenerPage == null) {
            throw new IllegalArgumentException("Listener page cannot be null");
        }

        String contentFingerprint = listenerPage.stream()
                .filter(Objects::nonNull)
                .map(this::generateListenerFingerprint)
                .sorted()
                .collect(Collectors.joining());

        int contentHash = Objects.hash(contentFingerprint);

        return String.format(PAGE_TAG_FORMAT,
                listenerPage.getSize(),
                contentHash
        );
    }

    private String generateListenerFingerprint(UserActivityDTO listener) {
        return String.format("%d-%s-%b",
                listener.getUserId(),
                listener.getAnonymousName(),
                listener.isInASession()
        );
    }

    private void validateListener(ListenerDetailsResponseDTO listener) {
        if (listener == null) {
            throw new IllegalArgumentException("Listener cannot be null");
        }
        if (listener.getListenerId() == null) {
            throw new IllegalArgumentException("Listener ID cannot be null");
        }
    }
}