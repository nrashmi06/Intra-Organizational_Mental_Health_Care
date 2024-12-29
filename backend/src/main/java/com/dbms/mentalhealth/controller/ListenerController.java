// Modified ListenerController.java
package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.exception.appointment.InvalidRequestException;
import com.dbms.mentalhealth.service.ListenerService;
import com.dbms.mentalhealth.urlMapper.ListenerUrlMapping;
import com.dbms.mentalhealth.util.Etags.ListenerETagGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
public class ListenerController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ListenerController.class);
    private final ListenerService listenerService;
    private final ListenerETagGenerator eTagGenerator;

    @Autowired
    public ListenerController(ListenerService listenerService, ListenerETagGenerator eTagGenerator) {
        this.listenerService = Objects.requireNonNull(listenerService, "listenerService cannot be null");
        this.eTagGenerator = Objects.requireNonNull(eTagGenerator, "eTagGenerator cannot be null");
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(ListenerUrlMapping.LISTENER_BY_ID)
    public ResponseEntity<ListenerDetailsResponseDTO> getListenerDetails(
            @RequestParam("type") String type,
            @RequestParam("id") Integer id,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {

        if (type == null || type.trim().isEmpty() || id == null) {
            return ResponseEntity.badRequest().build();
        }

        ListenerDetailsResponseDTO listener = listenerService.getListenerDetails(type, id);
        if (listener == null) {
            return ResponseEntity.notFound().build();
        }

        String eTag = eTagGenerator.generateListenerETag(listener);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(listener);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(ListenerUrlMapping.ALL_LISTENERS)
    public ResponseEntity<Page<UserActivityDTO>> getAllListeners(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "user.userId", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {

        try {
            Page<UserActivityDTO> listeners = listenerService.getListenersByFilters(status, search, pageable);

            if (listeners.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            String eTag = eTagGenerator.generatePageETag(listeners);
            if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
                return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                        .header(HttpHeaders.ETAG, eTag)
                        .build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.ETAG, eTag)
                    .body(listeners);
        } catch (InvalidRequestException e) {
            logger.error("Invalid request parameters", e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error fetching listeners", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(ListenerUrlMapping.SUSPEND_OR_UN_SUSPEND_LISTENER)
    public ResponseEntity<String> suspendOrUnSuspendListener(
            @PathVariable("listenerId") Integer listenerId,
            @RequestParam("action") String action) {

        if (listenerId == null || action == null || action.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String result = listenerService.suspendOrUnsuspendListener(listenerId, action);
        return ResponseEntity.ok(result);
    }
}