package com.revcart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendOTP(String email, String otp) {
        if (mailSender == null) {
            System.out.println("Email not configured. OTP for " + email + ": " + otp);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("RevCart - Email Verification OTP");
            message.setText("Your OTP for email verification is: " + otp + "\nThis OTP will expire in 10 minutes.");
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    public void sendPasswordResetOTP(String email, String otp) {
        if (mailSender == null) {
            System.out.println("Email not configured. Password reset OTP for " + email + ": " + otp);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("RevCart - Password Reset OTP");
            message.setText("Your OTP for password reset is: " + otp + "\nThis OTP will expire in 10 minutes.");
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    public String generateOTP() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}