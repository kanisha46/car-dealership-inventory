package com.incubytes.carinventory.service;

import com.incubytes.carinventory.dto.RegisterRequest;
import com.incubytes.carinventory.entity.Role;
import com.incubytes.carinventory.entity.User;
import com.incubytes.carinventory.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.incubytes.carinventory.dto.LoginRequest;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
    public void login(LoginRequest request) {

        userRepository.findByEmail(request.email());

    }
}