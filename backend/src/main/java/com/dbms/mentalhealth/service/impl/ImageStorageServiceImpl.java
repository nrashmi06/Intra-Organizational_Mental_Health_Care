package com.dbms.mentalhealth.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.dbms.mentalhealth.service.ImageStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageStorageServiceImpl implements ImageStorageService {

    private final Cloudinary cloudinary;

    @Autowired
    public ImageStorageServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public String uploadImage(MultipartFile image) throws Exception {
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Image file must not be null or empty");
        }

        try {
            // Upload image to Cloudinary
            Map<String, Object> uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.asMap(
                    "format", "jpg" // Automatically detect file type (image, pdf, etc.)
            ));
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            throw new Exception("Failed to upload image to Cloudinary", e);
        }
    }

    @Override
    public void deleteImage(String imageUrl) throws Exception {
        if (imageUrl == null || imageUrl.isEmpty()) {
            throw new IllegalArgumentException("Image URL must not be null or empty");
        }

        try {
            String publicId = extractPublicIdFromUrl(imageUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new Exception("Failed to delete image from Cloudinary", e);
        }
    }

    private String extractPublicIdFromUrl(String imageUrl) {
        String[] parts = imageUrl.split("/");
        String publicIdWithExtension = parts[parts.length - 1];
        return publicIdWithExtension.split("\\.")[0];
    }
}
