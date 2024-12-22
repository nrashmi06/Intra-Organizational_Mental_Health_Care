package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.massEmail.MassEmailRequestDTO;
import com.dbms.mentalhealth.service.EmailService;
import com.dbms.mentalhealth.urlMapper.EmailUrlMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class MassEmailController {

    private final EmailService emailService;

    @Autowired
    public MassEmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    Logger logger = LoggerFactory.getLogger(MassEmailController.class);
    @PostMapping(value = EmailUrlMapping.MASS_EMAIL, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> sendMassEmail(@RequestParam("recipientType") String recipientType,
                                                @ModelAttribute MassEmailRequestDTO request) {
        try {
            List<File> files = saveFiles(request.getFiles());
            emailService.sendMassEmail(recipientType, request, files, () -> deleteFiles(files));
            return ResponseEntity.ok("Mass email sending initiated");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send mass email: " + e.getMessage());
        }
    }

    private List<File> saveFiles(List<MultipartFile> multipartFiles) throws IOException {
        return multipartFiles.stream().map(file -> {
            try {
                File tempFile = new File(System.getProperty("java.io.tmpdir"), file.getOriginalFilename());
                file.transferTo(tempFile);
                return tempFile;
            } catch (IOException e) {
                throw new RuntimeException("Failed to save file: " + file.getOriginalFilename(), e);
            }
        }).collect(Collectors.toList());
    }

    private void deleteFiles(List<File> files) {
        logger.info("Deleting temporary files");
        for (File file : files) {
            if (file.exists()) {
                file.delete();
            }
        }
    }
}