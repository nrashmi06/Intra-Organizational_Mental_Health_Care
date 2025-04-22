// BlogResponseDTO.java
package com.dbms.mentalhealth.dto.blog.response;

import com.dbms.mentalhealth.enums.BlogApprovalStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogResponseDTO {
    private Integer postId;
    private String title;
    private String content;
    private Integer userId;
    private String imageUrl;
    private String summary;
    private Boolean isOpenForCommunication;
    private LocalDateTime publishDate;
    private int viewCount;
    private int likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean likedByCurrentUser;
    private BlogApprovalStatus blogApprovalStatus; // Add this field
}