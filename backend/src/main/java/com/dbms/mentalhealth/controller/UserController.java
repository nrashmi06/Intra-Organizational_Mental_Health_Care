package com.dbms.mentalhealth.controller;
import com.dbms.mentalhealth.dto.user.request.UserRegistrationRequestDTO;
import com.dbms.mentalhealth.dto.user.response.UserRegistrationResponseDTO;
import com.dbms.mentalhealth.service.UserService;
import com.dbms.mentalhealth.urlMapper.userUrl.UserUrlMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(UserUrlMapping.BASE_API)
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello World!";
    }
    @PostMapping(UserUrlMapping.USER_REGISTER)
    public ResponseEntity<UserRegistrationResponseDTO> registerUser(@RequestBody UserRegistrationRequestDTO userRegistrationDTO) {
        UserRegistrationResponseDTO userDTO = userService.registerUser(userRegistrationDTO);
        return ResponseEntity.ok(userDTO);
    }
}
