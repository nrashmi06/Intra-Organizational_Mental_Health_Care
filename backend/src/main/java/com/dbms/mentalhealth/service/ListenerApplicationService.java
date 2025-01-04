package com.dbms.mentalhealth.service;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationSummaryResponseDTO;
import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.listenerApplication.request.ListenerApplicationRequestDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ListenerApplicationService {
    ListenerApplicationResponseDTO submitApplication(ListenerApplicationRequestDTO applicationRequestDTO, MultipartFile certificate) throws Exception;
    ListenerApplicationResponseDTO getApplicationById(Integer applicationId);
    void deleteApplication(Integer applicationId);
    ListenerApplicationResponseDTO updateApplication(Integer applicationId, ListenerApplicationRequestDTO applicationRequestDTO, MultipartFile certificate) throws Exception;
    ListenerDetailsResponseDTO updateApplicationStatus(Integer applicationId, String status);
    ListenerApplicationResponseDTO getApplicationsByUserId(Integer userId);
    Page<ListenerApplicationSummaryResponseDTO> getApplications(String status, Pageable pageable);

}