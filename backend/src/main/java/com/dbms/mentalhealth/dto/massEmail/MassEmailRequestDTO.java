package com.dbms.mentalhealth.dto.massEmail;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class MassEmailRequestDTO {
    private String subject;
    private String body;
    private List<MultipartFile> files;
}