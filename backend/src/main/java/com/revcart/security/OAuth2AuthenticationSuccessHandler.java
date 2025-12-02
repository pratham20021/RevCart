package com.revcart.security;

import com.revcart.entity.User;
import com.revcart.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        
        // Find or create user
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        
        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            // Create new user
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setRole(User.Role.CUSTOMER);
            user.setEmailVerified(true);
            user.setPassword(""); // OAuth users don't need password
            userRepository.save(user);
        }
        
        // Generate JWT token
        String token = jwtUtils.generateTokenFromEmail(email);
        
        // Redirect to frontend with token
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:4200/oauth2/redirect")
                .queryParam("token", token)
                .build().toUriString();
        
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}