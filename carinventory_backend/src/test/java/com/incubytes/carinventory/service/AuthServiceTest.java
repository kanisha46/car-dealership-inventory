package com.incubytes.carinventory.service;

import com.incubytes.carinventory.dto.LoginRequest;
import com.incubytes.carinventory.dto.LoginResponse;
import com.incubytes.carinventory.dto.RegisterRequest;
import com.incubytes.carinventory.entity.Role;
import com.incubytes.carinventory.entity.User;
import com.incubytes.carinventory.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    @Test
    void shouldRegisterNewUser() {

        RegisterRequest request = new RegisterRequest(
                "John Doe",
                "john@example.com",
                "password123"
        );

        when(userRepository.existsByEmail(request.email()))
                .thenReturn(false);

        authService.register(request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);

        verify(userRepository).save(captor.capture());

        User savedUser = captor.getValue();

        assertThat(savedUser.getName()).isEqualTo("John Doe");
        assertThat(savedUser.getEmail()).isEqualTo("john@example.com");
        assertThat(savedUser.getRole()).isEqualTo(Role.USER);
    }

    @Test
    void shouldLoginUser() {

        LoginRequest request = new LoginRequest(
                "john@example.com",
                "password123"
        );

        User user = new User(
                "John Doe",
                "john@example.com",
                "password123",
                Role.USER
        );

        when(userRepository.findByEmail(request.email()))
                .thenReturn(Optional.of(user));

        authService.login(request);

        verify(userRepository).findByEmail(request.email());
    }

    @Test
    void shouldThrowExceptionWhenUserDoesNotExist() {

        LoginRequest request = new LoginRequest(
                "john@example.com",
                "password123"
        );

        when(userRepository.findByEmail(request.email()))
                .thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.login(request)
        );

        assertThat(exception.getMessage())
                .isEqualTo("User not found");
    }
    @Test
    void shouldThrowExceptionWhenPasswordIsIncorrect() {

        LoginRequest request = new LoginRequest(
                "john@example.com",
                "wrongPassword"
        );

        User user = new User(
                "John Doe",
                "john@example.com",
                "password123",
                Role.USER
        );

        when(userRepository.findByEmail(request.email()))
                .thenReturn(Optional.of(user));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.login(request)
        );

        assertThat(exception.getMessage())
                .isEqualTo("Invalid password");
    }
    @Test
    void shouldReturnLoginResponseWhenCredentialsAreValid() {

        LoginRequest request = new LoginRequest(
                "john@example.com",
                "password123"
        );

        User user = new User(
                "John Doe",
                "john@example.com",
                "password123",
                Role.USER
        );

        when(userRepository.findByEmail(request.email()))
                .thenReturn(Optional.of(user));

        LoginResponse response = authService.login(request);

        assertThat(response.message())
                .isEqualTo("Login successful");
    }
}