package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.config.ChatWebSocketHandler;
import com.dbms.mentalhealth.dto.chatMessage.ChatMessageDTO;
import com.dbms.mentalhealth.dto.session.response.SessionResponseDTO;
import com.dbms.mentalhealth.dto.session.response.SessionSummaryDTO;
import com.dbms.mentalhealth.service.SessionService;
import com.dbms.mentalhealth.urlMapper.SessionUrlMapping;
import com.dbms.mentalhealth.util.Etags.SessionETagGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
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

@RestController
public class SessionController {

    private final SessionService sessionService;
    private final ChatWebSocketHandler chatWebSocketHandler;
    private final SessionETagGenerator eTagGenerator;

    @Autowired
    public SessionController(SessionService sessionService, ChatWebSocketHandler chatWebSocketHandler, SessionETagGenerator eTagGenerator) {
        this.sessionService = sessionService;
        this.chatWebSocketHandler = chatWebSocketHandler;
        this.eTagGenerator = eTagGenerator;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping(SessionUrlMapping.INITIATE_SESSION)
    public ResponseEntity<String> initiateSession(@PathVariable Integer listenerId, @RequestBody String message) throws JsonProcessingException {
        String sessionDetails = sessionService.initiateSession(listenerId, message);
        return ResponseEntity.ok(sessionDetails);
    }

    @PreAuthorize("hasRole('ROLE_LISTENER')")
    @PostMapping(SessionUrlMapping.UPDATE_SESSION_STATUS)
    public ResponseEntity<String> updateSessionStatus(@PathVariable Integer userId, @RequestParam String action) {
        String response = sessionService.updateSessionStatus(userId, action);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionUrlMapping.GET_SESSION_BY_ID)
    public ResponseEntity<SessionResponseDTO> getSessionById(
            @PathVariable Integer sessionId,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {
        SessionResponseDTO sessionResponseDTO = sessionService.getSessionById(sessionId);
        String eTag = eTagGenerator.generateSessionETag(sessionResponseDTO);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(sessionResponseDTO);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping(SessionUrlMapping.END_SESSION)
    public ResponseEntity<String> endSession(@PathVariable Integer sessionId) {
        String response = sessionService.endSession(sessionId);
        chatWebSocketHandler.endSession(sessionId.toString());
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionUrlMapping.GET_MESSAGES_BY_SESSION_ID)
    public ResponseEntity<List<ChatMessageDTO>> getMessagesBySessionId(@PathVariable Integer sessionId) {
        List<ChatMessageDTO> messages = sessionService.getMessagesBySessionId(sessionId);
        return ResponseEntity.ok(messages);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionUrlMapping.AVG_SESSION_DURATION)
    public String getAverageSessionDuration() {
        return sessionService.getAverageSessionDuration();
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionUrlMapping.GET_SESSIONS_BY_FILTERS)
    public ResponseEntity<Page<SessionSummaryDTO>> getSessionsByFilters(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String idType,
            @PageableDefault(size = 10, sort = "sessionId", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {

        Page<SessionSummaryDTO> sessions = sessionService.getSessionsByFilters(status, id, idType, pageable);

        String eTag = eTagGenerator.generatePageETag(sessions);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(sessions);
    }
}