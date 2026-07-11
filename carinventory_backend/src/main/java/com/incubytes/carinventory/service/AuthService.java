package com.incubytes.carinventory.service;

import com.incubytes.carinventory.dto.LoginResponse;
import com.incubytes.carinventory.dto.RegisterRequest;
import com.incubytes.carinventory.entity.Role;
import com.incubytes.carinventory.entity.User;
import com.incubytes.carinventory.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.incubytes.carinventory.dto.LoginRequest;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    
    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public void register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User(
                request.name(),
                request.email(),
                request.password(),
                Role.USER
        );

        userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!user.getPassword().equals(request.password())) {
            throw new IllegalArgumentException("Invalid password");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(
                "Login successful",
                token
        );
    }
}