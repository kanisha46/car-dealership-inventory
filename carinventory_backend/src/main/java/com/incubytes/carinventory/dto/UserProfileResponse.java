package com.incubytes.carinventory.dto;

public record UserProfileResponse(
        Long id,
        String name,
        String email,
        String role
) {}
