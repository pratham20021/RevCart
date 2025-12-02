package com.revcart.controller;

import com.revcart.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/email")
    public String testEmail() {
        try {
            String otp = emailService.generateOTP();
            emailService.sendOTP("prathameshpatil.xx@gmail.com", otp);
            return "Email sent successfully! OTP: " + otp;
        } catch (Exception e) {
            return "Email failed: " + e.getMessage();
        }
    }
}