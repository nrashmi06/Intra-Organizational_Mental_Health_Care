package com.dbms.mentalhealth.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "blog_likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"blog_id", "user_id"})
})
public class BlogLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "blog_id", nullable = false) // Map to blog_id
    private Blog blog;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // Map to user_id
    private User user;
}
