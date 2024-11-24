//package com.dbms.mentalhealth.controller;
//
//import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
//import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
//import com.dbms.mentalhealth.service.impl.BlogServiceImpl;
//import com.dbms.mentalhealth.urlMapper.BlogUrlMapping;
//import com.dbms.mentalhealth.security.jwt.JwtUtils;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.MockitoAnnotations;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.mock.web.MockMultipartFile;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.junit.jupiter.api.extension.ExtendWith;
//
//import java.io.FileInputStream;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@ExtendWith(SpringExtension.class)
//@SpringBootTest
//@AutoConfigureMockMvc
//public class BlogControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private BlogServiceImpl blogServiceImpl;
//
//    @MockBean
//    private JwtUtils jwtUtils;
//
//    @InjectMocks
//    private BlogController blogController;
//
//    @BeforeEach
//    public void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    @WithMockUser(username = "user", roles = {"USER"})
//    public void testCreateBlogWithImage() throws Exception {
//        BlogRequestDTO blogRequestDTO = new BlogRequestDTO();
//        blogRequestDTO.setTitle("My Blog");
//        blogRequestDTO.setContent("This is the content");
//        blogRequestDTO.setUserId(1);
//        blogRequestDTO.setSummary("This is a summary");
//
//        BlogResponseDTO blogResponseDTO = new BlogResponseDTO();
//        blogResponseDTO.setPostId(1);
//        blogResponseDTO.setTitle("My Blog");
//        blogResponseDTO.setContent("This is the content");
//
//        when(blogServiceImpl.createBlog(any(BlogRequestDTO.class), any(MockMultipartFile.class))).thenReturn(blogResponseDTO);
//
//        MockMultipartFile blog = new MockMultipartFile("blog", "", "application/json", "{\"title\": \"My Blog\", \"content\": \"This is the content\", \"userId\": 1, \"summary\": \"This is a summary\"}".getBytes());
//        MockMultipartFile image = new MockMultipartFile("image", "image.jpg", "image/jpeg", new FileInputStream("C:\\Users\\ajayp\\Downloads\\S0949343.JPG"));
//
//        mockMvc.perform(MockMvcRequestBuilders.multipart(BlogUrlMapping.CREATE_BLOG)
//                        .file(blog)
//                        .file(image)
//                        .contentType(MediaType.MULTIPART_FORM_DATA)
//                        .accept(MediaType.APPLICATION_JSON))
//                .andExpect(status().isCreated())
//                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
//                .andExpect(content().json("{\"postId\":1,\"title\":\"My Blog\",\"content\":\"This is the content\"}"));
//    }
//}