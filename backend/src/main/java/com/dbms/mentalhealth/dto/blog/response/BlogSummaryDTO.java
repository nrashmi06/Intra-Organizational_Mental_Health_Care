package com.dbms.mentalhealth.dto.blog.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogSummaryDTO {
    private Integer id;
    private String title;
    private String summary;
    private Boolean isOpenForCommunication;
    private Integer likeCount;
    private String imageUrl;
    private boolean likedByCurrentUser;
}