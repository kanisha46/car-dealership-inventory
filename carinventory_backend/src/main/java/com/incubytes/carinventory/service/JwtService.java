package com.incubytes.carinventory.service;

import com.incubytes.carinventory.entity.User;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    public String generateToken(User user) {
        return "dummy-jwt-token";
    }
}