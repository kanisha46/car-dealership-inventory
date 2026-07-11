package com.incubytes.carinventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "testuser")
    void shouldCreateVehicleWithCategoryAndQuantity() throws Exception {

        String vehicle = """
    {
        "brand":"Toyota",
        "model":"Fortuner",
        "category":"SUV",
        "year":2023,
        "price":4200000,
        "quantity":10
    }
    """;

        mockMvc.perform(post("/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(vehicle))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.category").value("SUV"))
                .andExpect(jsonPath("$.quantity").value(10));
    }
}