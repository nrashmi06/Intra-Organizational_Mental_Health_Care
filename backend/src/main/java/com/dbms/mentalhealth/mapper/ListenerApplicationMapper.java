// ListenerApplicationMapper.java
package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.listenerApplication.request.ListenerApplicationRequestDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationResponseDTO;
import com.dbms.mentalhealth.dto.Listener.response.ListenerApplicationSummaryResponseDTO;
import com.dbms.mentalhealth.model.ListenerApplication;
import com.dbms.mentalhealth.model.User;
import org.springframework.stereotype.Component;

@Component
public class ListenerApplicationMapper {

    public static ListenerApplication toEntity(ListenerApplicationRequestDTO requestDTO, User user) {
        ListenerApplication entity = new ListenerApplication();
        entity.setUser(user); // Set User object instead of userId
        entity.setFullName(requestDTO.getFullName());
        entity.setBranch(requestDTO.getBranch());
        entity.setSemester(requestDTO.getSemester());
        entity.setUsn(requestDTO.getUsn());
        entity.setPhoneNumber(requestDTO.getPhoneNumber());
        return entity;
    }

    public static ListenerApplicationResponseDTO toResponseDTO(ListenerApplication entity) {
        ListenerApplicationResponseDTO responseDTO = new ListenerApplicationResponseDTO();
        responseDTO.setApplicationId(entity.getApplicationId());
        responseDTO.setFullName(entity.getFullName());
        responseDTO.setBranch(entity.getBranch());
        responseDTO.setSemester(entity.getSemester());
        responseDTO.setUsn(entity.getUsn());
        responseDTO.setPhoneNumber(entity.getPhoneNumber());
        responseDTO.setCertificateUrl(entity.getCertificateUrl());
        responseDTO.setApplicationStatus(entity.getApplicationStatus());
        responseDTO.setSubmissionDate(entity.getSubmissionDate());
        responseDTO.setReviewedBy(entity.getReviewedBy() != null ? entity.getReviewedBy().getAnonymousName() : null);
        responseDTO.setReviewedAt(entity.getReviewedAt());
        return responseDTO;
    }

    public static ListenerApplicationSummaryResponseDTO toSummaryResponseDTO(ListenerApplication entity) {
        ListenerApplicationSummaryResponseDTO summaryDTO = new ListenerApplicationSummaryResponseDTO();
        summaryDTO.setApplicationId(entity.getApplicationId());
        summaryDTO.setFullName(entity.getFullName());
        summaryDTO.setBranch(entity.getBranch());
        summaryDTO.setSemester(entity.getSemester());
        summaryDTO.setCertificateUrl(entity.getCertificateUrl());
        return summaryDTO;
    }
}