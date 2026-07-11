package com.incubytes.carinventory.dto;

public record RegisterRequest(
        String name,
        String email,
        String password
) {}