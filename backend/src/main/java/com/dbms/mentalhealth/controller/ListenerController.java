// Modified ListenerController.java
package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.service.ListenerService;
import com.dbms.mentalhealth.urlMapper.ListenerUrlMapping;
import com.dbms.mentalhealth.util.Etags.ListenerETagGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
public class ListenerController {

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
    public ResponseEntity<List<UserActivityDTO>> getAllListeners(
            @RequestParam(value = "type", required = false) String type,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {

        List<UserActivityDTO> listeners = listenerService.getAllListeners(type);
        if (listeners == null || listeners.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        String eTag = eTagGenerator.generateListETag(listeners);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(listeners);
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