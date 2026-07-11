package com.incubytes.carinventory.service;

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

import static org.assertj.core.api.Assertions.assertThat;
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
}