package com.revcart.controller;

import com.revcart.dto.JwtResponse;
import com.revcart.dto.LoginRequest;
import com.revcart.dto.SignupRequest;
import com.revcart.entity.User;
import com.revcart.repository.UserRepository;
import com.revcart.security.JwtUtils;
import com.revcart.security.UserPrincipal;
import com.revcart.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    @Autowired
    AuthenticationManager authenticationManager;
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    PasswordEncoder encoder;
    
    @Autowired
    JwtUtils jwtUtils;
    
    @Autowired
    UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
        
        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getEmail(),
                userRepository.findByEmail(userDetails.getEmail()).get().getRole()));
    }
    
    @PostMapping("/signup")
    @Transactional
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            System.out.println("Signup request received for email: " + signUpRequest.getEmail());
            
            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body("Error: Email is already in use!");
            }
            
            // Create new user's account
            User user = new User();
            user.setName(signUpRequest.getName());
            user.setEmail(signUpRequest.getEmail());
            user.setPassword(encoder.encode(signUpRequest.getPassword()));
            user.setPhone(signUpRequest.getPhone());
            user.setAddress(signUpRequest.getAddress());
            user.setRole(signUpRequest.getRole() != null ? signUpRequest.getRole() : User.Role.CUSTOMER);
            
            System.out.println("Saving user: " + user.getEmail() + " with role: " + user.getRole());
            User savedUser = userRepository.save(user);
            System.out.println("User saved with ID: " + savedUser.getId());
            
            // Auto login after signup
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(signUpRequest.getEmail(), signUpRequest.getPassword()));
            
            String jwt = jwtUtils.generateJwtToken(authentication);
            UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
            
            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getName(),
                    userDetails.getEmail(),
                    savedUser.getRole()));
        } catch (Exception e) {
            System.err.println("Error during signup: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating user: " + e.getMessage());
        }
    }
    
    @PostMapping("/send-verification-otp")
    public ResponseEntity<?> sendVerificationOTP(@RequestBody Map<String, String> request) {
        try {
            String otp = userService.sendVerificationOTP(request.get("email"));
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully", "otp", otp));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending OTP: " + e.getMessage());
        }
    }
    
    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        try {
            boolean verified = userService.verifyEmail(request.get("email"), request.get("otp"));
            if (verified) {
                return ResponseEntity.ok("Email verified successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid or expired OTP");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error verifying email: " + e.getMessage());
        }
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String otp = userService.sendPasswordResetOTP(request.get("email"));
            return ResponseEntity.ok(Map.of("message", "Password reset OTP sent successfully", "otp", otp));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending password reset OTP: " + e.getMessage());
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            boolean reset = userService.resetPassword(
                request.get("email"), 
                request.get("otp"), 
                request.get("newPassword")
            );
            if (reset) {
                return ResponseEntity.ok("Password reset successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid or expired OTP");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error resetting password: " + e.getMessage());
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody User updatedUser) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User user = userService.updateProfile(userPrincipal.getId(), updatedUser);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage());
        }
    }
}