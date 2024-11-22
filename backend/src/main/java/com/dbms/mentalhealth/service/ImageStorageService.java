package com.dbms.mentalhealth.service;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {
    String uploadImage(MultipartFile image) throws Exception;
    void deleteImage(String imageUrl) throws Exception;
}
