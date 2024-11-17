package com.dbms.mentalhealth.dto.blog.request;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogRequestDTO {
    private String title;
    private String content;
    private Integer userId;
    private String summary;
}