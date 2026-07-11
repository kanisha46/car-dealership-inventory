package com.incubytes.carinventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.incubytes.carinventory.entity.Vehicle;
import com.incubytes.carinventory.repository.VehicleRepository;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.junit.jupiter.api.Assertions.assertFalse;

@SpringBootTest
@AutoConfigureMockMvc
class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Test
    @WithMockUser(username = "testuser", roles = "ADMIN")
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

        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(vehicle))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.category").value("SUV"))
                .andExpect(jsonPath("$.quantity").value(10));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void shouldUpdateVehicle() throws Exception {

        Vehicle vehicle = new Vehicle();
        vehicle.setBrand("Toyota");
        vehicle.setModel("Fortuner");
        vehicle.setCategory("SUV");
        vehicle.setYear(2023);
        vehicle.setPrice(4200000.0);
        vehicle.setQuantity(10);

        vehicle = vehicleRepository.save(vehicle);

        String updatedVehicle = """
    {
        "brand":"BMW",
        "model":"X5",
        "category":"SUV",
        "year":2024,
        "price":5500000,
        "quantity":5
    }
    """;

        mockMvc.perform(put("/api/vehicles/" + vehicle.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedVehicle))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.brand").value("BMW"))
                .andExpect(jsonPath("$.model").value("X5"));
    }
    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void shouldDeleteVehicle() throws Exception {

        Vehicle vehicle = new Vehicle();
        vehicle.setBrand("Toyota");
        vehicle.setModel("Fortuner");
        vehicle.setCategory("SUV");
        vehicle.setYear(2023);
        vehicle.setPrice(4200000.0);
        vehicle.setQuantity(10);

        vehicle = vehicleRepository.save(vehicle);

        mockMvc.perform(delete("/api/vehicles/" + vehicle.getId()))
                .andExpect(status().isNoContent());

        assertFalse(vehicleRepository.findById(vehicle.getId()).isPresent());
    }
    @Test
    @WithMockUser(username = "user")
    void shouldPurchaseVehicle() throws Exception {

        Vehicle vehicle = new Vehicle();
        vehicle.setBrand("Toyota");
        vehicle.setModel("Fortuner");
        vehicle.setCategory("SUV");
        vehicle.setYear(2023);
        vehicle.setPrice(4200000.0);
        vehicle.setQuantity(10);

        vehicle = vehicleRepository.save(vehicle);

        mockMvc.perform(post("/api/vehicles/" + vehicle.getId() + "/purchase"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(9));
    }
    @Test
    @WithMockUser(username = "user")
    void shouldNotPurchaseOutOfStockVehicle() throws Exception {

        Vehicle vehicle = new Vehicle();
        vehicle.setBrand("BMW");
        vehicle.setModel("X5");
        vehicle.setCategory("SUV");
        vehicle.setYear(2024);
        vehicle.setPrice(6000000.0);
        vehicle.setQuantity(0);

        vehicle = vehicleRepository.save(vehicle);

        mockMvc.perform(post("/api/vehicles/" + vehicle.getId() + "/purchase"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user")
    void shouldFailPurchaseIfVehicleNotFound() throws Exception {
        mockMvc.perform(post("/api/vehicles/99999/purchase"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void shouldRestockVehicleSuccessfully() throws Exception {
        Vehicle vehicle = new Vehicle();
        vehicle.setBrand("Toyota");
        vehicle.setModel("Fortuner");
        vehicle.setCategory("SUV");
        vehicle.setYear(2023);
        vehicle.setPrice(4200000.0);
        vehicle.setQuantity(10);

        vehicle = vehicleRepository.save(vehicle);

        mockMvc.perform(post("/api/vehicles/" + vehicle.getId() + "/restock")
                        .param("quantity", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(15));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void shouldFailRestockIfVehicleNotFound() throws Exception {
        mockMvc.perform(post("/api/vehicles/99999/restock")
                        .param("quantity", "5"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void shouldFailRestockIfQuantityIsInvalid() throws Exception {
        Vehicle vehicle = new Vehicle();
        vehicle.setBrand("Toyota");
        vehicle.setModel("Fortuner");
        vehicle.setCategory("SUV");
        vehicle.setYear(2023);
        vehicle.setPrice(4200000.0);
        vehicle.setQuantity(10);

        vehicle = vehicleRepository.save(vehicle);

        mockMvc.perform(post("/api/vehicles/" + vehicle.getId() + "/restock")
                        .param("quantity", "-5"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    void shouldFailRestockIfUserIsUnauthorized() throws Exception {
        mockMvc.perform(post("/api/vehicles/1/restock")
                        .param("quantity", "5"))
                .andExpect(status().isForbidden());
    }
}