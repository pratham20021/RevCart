package com.revcart.service;

import com.revcart.entity.User;
import com.revcart.entity.PasswordResetToken;
import com.revcart.repository.UserRepository;
import com.revcart.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User saveUser(User user) {
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    @Transactional
    public String sendVerificationOTP(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        String otp = emailService.generateOTP();
        user.setVerificationOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);
        emailService.sendOTP(email, otp);
        return otp;
    }
    
    @Transactional
    public boolean verifyEmail(String email, String otp) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null && otp.equals(user.getVerificationOtp()) && 
            user.getOtpExpiry() != null && LocalDateTime.now().isBefore(user.getOtpExpiry())) {
            user.setEmailVerified(true);
            user.setVerificationOtp(null);
            user.setOtpExpiry(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }
    
    @Transactional
    public String sendPasswordResetOTP(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new RuntimeException("No account found with email: " + email);
        }
        passwordResetTokenRepository.deleteByEmail(email);
        String otp = emailService.generateOTP();
        PasswordResetToken token = new PasswordResetToken(email, otp);
        passwordResetTokenRepository.save(token);
        emailService.sendPasswordResetOTP(email, otp);
        return otp;
    }
    
    @Transactional
    public boolean resetPassword(String email, String otp, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByEmailAndOtpAndUsedFalse(email, otp);
        if (tokenOpt.isPresent()) {
            PasswordResetToken token = tokenOpt.get();
            if (!token.isExpired()) {
                User user = userRepository.findByEmail(email).orElseThrow();
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                token.setUsed(true);
                passwordResetTokenRepository.save(token);
                return true;
            }
        }
        return false;
    }
    
    @Transactional
    public User updateProfile(Long userId, User updatedUser) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setName(updatedUser.getName());
        user.setPhone(updatedUser.getPhone());
        user.setAddress(updatedUser.getAddress());
        return userRepository.save(user);
    }
}