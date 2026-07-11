package com.incubytes.carinventory.dto;

public record LoginRequest(
        String email,
        String password
) {
}