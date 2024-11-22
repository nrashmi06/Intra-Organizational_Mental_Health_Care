package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.listenerApplication.request.ListenerApplicationRequestDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationResponseDTO;
import com.dbms.mentalhealth.service.ListenerApplicationService;
import com.dbms.mentalhealth.urlMapper.ListenerApplicationUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
public class ListenerApplicationController {

    @Autowired
    private ListenerApplicationService listenerApplicationService;

    @PostMapping(value = ListenerApplicationUrlMapping.SUBMIT_APPLICATION,consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ListenerApplicationResponseDTO> submitApplication(
            @RequestPart("application") ListenerApplicationRequestDTO applicationRequestDTO,
            @RequestPart("certificate") MultipartFile certificate) throws Exception {
        ListenerApplicationResponseDTO responseDTO = listenerApplicationService.submitApplication(applicationRequestDTO, certificate);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping(ListenerApplicationUrlMapping.GET_APPLICATION_BY_ID)
    public ResponseEntity<ListenerApplicationResponseDTO> getApplicationById(@PathVariable("applicationId") Integer applicationId) {
        ListenerApplicationResponseDTO responseDTO = listenerApplicationService.getApplicationById(applicationId);
        return ResponseEntity.ok(responseDTO);
    }


}