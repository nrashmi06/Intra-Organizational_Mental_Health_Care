package com.dbms.mentalhealth;

import com.dbms.mentalhealth.service.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class EmailServiceTest {
      //lets send a mail

    @Autowired
    private EmailService emailService;
        @Test
        public void sendEmailTest() {
            try{
                emailService.sendEmail("nnm22ad069@nmamit.in", "Test", "This is a test email sent using springboot applictoin " +
                        "to fill ur remaining inbox space :)");
            }catch (Exception e) {
                e.printStackTrace();
            }
        }

}
