package com.incubytes.carinventory.service;

import com.incubytes.carinventory.entity.User;

public interface JwtService {

    String generateToken(User user);

}