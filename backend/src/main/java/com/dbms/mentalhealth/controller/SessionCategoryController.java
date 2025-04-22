package com.dbms.mentalhealth.controller;
import com.dbms.mentalhealth.dto.session.response.SessionTagCountDTO;
import com.dbms.mentalhealth.dto.session.response.SimpleSessionDTO;
import com.dbms.mentalhealth.enums.SessionCategory;
import com.dbms.mentalhealth.model.SessionStatus;
import com.dbms.mentalhealth.repository.SessionStatusRepository;
import com.dbms.mentalhealth.urlMapper.SessionStatusUrlMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class SessionCategoryController {

    private static final Logger logger = LoggerFactory.getLogger(SessionCategoryController.class);

    @Autowired
    private SessionStatusRepository sessionStatusRepository;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionStatusUrlMapping.FILTER_SESSIONS)
    public ResponseEntity<List<SimpleSessionDTO>> getSessions(
            @RequestParam(required = false) SessionCategory sessionCategory) {

        logger.info("Entered getSessions endpoint");
        logger.debug("Received sessionCategory: {}", sessionCategory);

        List<SessionStatus> sessionStatuses;

        try {
            if (sessionCategory != null) {
                logger.info("Filtering sessions by category: {}", sessionCategory);
                sessionStatuses = sessionStatusRepository.findByCategory(SessionCategory.valueOf(sessionCategory.name()));
            } else {
                logger.info("No category provided, retrieving all sessions");
                sessionStatuses = sessionStatusRepository.findAll();
            }

            logger.debug("Number of session statuses retrieved: {}", sessionStatuses.size());

            List<SimpleSessionDTO> sessionDTOs = sessionStatuses.stream()
                    .map(sessionStatus -> {
                        logger.trace("Mapping SessionActivityStatus to DTO: sessionId={}, category={}, summary={}",
                                sessionStatus.getSession().getSessionId(),
                                sessionStatus.getCategory(),
                                sessionStatus.getSummary());
                        return new SimpleSessionDTO(
                                sessionStatus.getSession().getSessionId(),
                                sessionStatus.getCategory(),
                                sessionStatus.getSummary()
                        );
                    })
                    .collect(Collectors.toList());

            logger.info("Returning {} session DTOs", sessionDTOs.size());
            return ResponseEntity.ok(sessionDTOs);

        } catch (Exception e) {
            logger.error("Error occurred while fetching sessions", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionStatusUrlMapping.USER_SESSION_TAG_COUNTS)
    public ResponseEntity<SessionTagCountDTO> getSessionTagCounts(
            @RequestParam(required = false) Long userId) {

        logger.info("Entered getSessionTagCounts endpoint");
        logger.debug("Received userId: {}", userId);

        try {
            List<SessionStatus> sessionStatuses;

            if (userId != null) {
                logger.info("Filtering sessions by userId: {}", userId);
                sessionStatuses = sessionStatusRepository.findBySessionUserId(userId);
                logger.debug("Retrieved {} sessions for user with ID {}", sessionStatuses.size(), userId);
            } else {
                logger.info("No userId provided, retrieving all sessions");
                sessionStatuses = sessionStatusRepository.findAll();
                logger.debug("Retrieved {} sessions in total", sessionStatuses.size());
            }

            // Count sessions by category
            long stressCount = sessionStatuses.stream()
                    .filter(s -> s.getCategory() == SessionCategory.STRESS)
                    .count();

            long depressionCount = sessionStatuses.stream()
                    .filter(s -> s.getCategory() == SessionCategory.DEPRESSION)
                    .count();

            long suicidalCount = sessionStatuses.stream()
                    .filter(s -> s.getCategory() == SessionCategory.SUICIDAL)
                    .count();

            long breakupCount = sessionStatuses.stream()
                    .filter(s -> s.getCategory() == SessionCategory.BREAKUP)
                    .count();

            long anxietyCount = sessionStatuses.stream()
                    .filter(s -> s.getCategory() == SessionCategory.ANXIETY)
                    .count();

            long griefCount = sessionStatuses.stream()
                    .filter(s -> s.getCategory() == SessionCategory.GRIEF)
                    .count();

            long traumaCount = sessionStatuses.stream()
                    .filter(s -> s.getCategory() == SessionCategory.TRAUMA)
                    .count();

            long relationshipIssuesCount = sessionStatuses.stream()
                    .filter(s -> s.getCategory() == SessionCategory.RELATIONSHIP_ISSUES)
                    .count();

            long selfEsteemCount = sessionStatuses.stream()
                    .filter(s -> s.getCategory() == SessionCategory.SELF_ESTEEM)
                    .count();

            long otherCount = sessionStatuses.stream()
                    .filter(s -> s.getCategory() == SessionCategory.OTHER)
                    .count();

            // Create and populate the DTO
            SessionTagCountDTO tagCounts = new SessionTagCountDTO();
            tagCounts.setStressCount((int) stressCount);
            tagCounts.setDepressionCount((int) depressionCount);
            tagCounts.setSuicidalCount((int) suicidalCount);
            tagCounts.setBreakupCount((int) breakupCount);
            tagCounts.setAnxietyCount((int) anxietyCount);
            tagCounts.setGriefCount((int) griefCount);
            tagCounts.setTraumaCount((int) traumaCount);
            tagCounts.setRelationshipIssuesCount((int) relationshipIssuesCount);
            tagCounts.setSelfEsteemCount((int) selfEsteemCount);
            tagCounts.setOtherCount((int) otherCount);

            logger.info("Successfully retrieved session tag counts");
            logger.debug("Tag counts: stress={}, depression={}, suicidal={}, breakup={}, " +
                            "anxiety={}, grief={}, trauma={}, relationshipIssues={}, " +
                            "selfEsteem={}, other={}",
                    stressCount, depressionCount, suicidalCount, breakupCount,
                    anxietyCount, griefCount, traumaCount, relationshipIssuesCount,
                    selfEsteemCount, otherCount);

            return ResponseEntity.ok(tagCounts);
        } catch (Exception e) {
            logger.error("Error occurred while fetching session tag counts", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}