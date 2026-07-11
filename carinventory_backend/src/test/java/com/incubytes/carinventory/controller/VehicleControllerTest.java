package com.incubytes.carinventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.incubytes.carinventory.entity.Vehicle;
import com.incubytes.carinventory.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private VehicleRepository vehicleRepository;

    /**
     * Wipe all vehicles before each test to prevent data pollution
     * across tests that share the same SQLite database file.
     */
    @BeforeEach
    void cleanDatabase() {
        vehicleRepository.deleteAll();
    }

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
    @Test
    @WithMockUser
    void shouldSearchVehicleByBrand() throws Exception {

        Vehicle vehicle = new Vehicle();
        vehicle.setBrand("Toyota");
        vehicle.setModel("Fortuner");
        vehicle.setYear(2023);
        vehicle.setPrice(4200000.0);
        vehicle.setQuantity(10);

        vehicleRepository.save(vehicle);

        mockMvc.perform(get("/api/vehicles/search")
                        .param("brand", "Toyota"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].brand").value("Toyota"));
    }
    @Test
    @WithMockUser(username = "user", roles = "USER")
    void shouldFilterVehiclesByPriceRange() throws Exception {

        Vehicle vehicle1 = new Vehicle();
        vehicle1.setBrand("Toyota");
        vehicle1.setModel("Fortuner");
        vehicle1.setCategory("SUV");
        vehicle1.setYear(2023);
        vehicle1.setPrice(4200000.0);
        vehicle1.setQuantity(5);

        Vehicle vehicle2 = new Vehicle();
        vehicle2.setBrand("Honda");
        vehicle2.setModel("City");
        vehicle2.setCategory("Sedan");
        vehicle2.setYear(2022);
        vehicle2.setPrice(1500000.0);
        vehicle2.setQuantity(8);

        vehicleRepository.save(vehicle1);
        vehicleRepository.save(vehicle2);

        mockMvc.perform(get("/api/vehicles/search")
                        .param("minPrice", "1000000")
                        .param("maxPrice", "2000000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].brand").value("Honda"));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    void shouldSearchVehicleByModel() throws Exception {

        Vehicle vehicle = new Vehicle();
        vehicle.setBrand("BMW");
        vehicle.setModel("X5");
        vehicle.setCategory("SUV");
        vehicle.setYear(2024);
        vehicle.setPrice(8000000.0);
        vehicle.setQuantity(3);

        vehicleRepository.save(vehicle);

        mockMvc.perform(get("/api/vehicles/search")
                        .param("model", "X5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].model").value("X5"));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    void shouldFilterVehiclesByYear() throws Exception {

        Vehicle v2022 = new Vehicle();
        v2022.setBrand("Honda");
        v2022.setModel("City");
        v2022.setCategory("Sedan");
        v2022.setYear(2022);
        v2022.setPrice(1200000.0);
        v2022.setQuantity(4);

        Vehicle v2024 = new Vehicle();
        v2024.setBrand("Toyota");
        v2024.setModel("Camry");
        v2024.setCategory("Sedan");
        v2024.setYear(2024);
        v2024.setPrice(3500000.0);
        v2024.setQuantity(2);

        vehicleRepository.save(v2022);
        vehicleRepository.save(v2024);

        mockMvc.perform(get("/api/vehicles/search")
                        .param("year", "2022"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.year == 2022)]").exists());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    void shouldCombineBrandAndPriceRangeFilters() throws Exception {

        Vehicle bmwCheap = new Vehicle();
        bmwCheap.setBrand("BMW");
        bmwCheap.setModel("X1");
        bmwCheap.setCategory("SUV");
        bmwCheap.setYear(2021);
        bmwCheap.setPrice(4000000.0);
        bmwCheap.setQuantity(5);

        Vehicle bmwExpensive = new Vehicle();
        bmwExpensive.setBrand("BMW");
        bmwExpensive.setModel("X7");
        bmwExpensive.setCategory("SUV");
        bmwExpensive.setYear(2024);
        bmwExpensive.setPrice(12000000.0);
        bmwExpensive.setQuantity(1);

        vehicleRepository.save(bmwCheap);
        vehicleRepository.save(bmwExpensive);

        mockMvc.perform(get("/api/vehicles/search")
                        .param("brand", "BMW")
                        .param("minPrice", "3000000")
                        .param("maxPrice", "6000000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.model == 'X1')]").exists())
                .andExpect(jsonPath("$[?(@.model == 'X7')]").doesNotExist());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    void shouldCombineModelAndYearFilters() throws Exception {

        Vehicle v = new Vehicle();
        v.setBrand("Toyota");
        v.setModel("Fortuner");
        v.setCategory("SUV");
        v.setYear(2023);
        v.setPrice(4200000.0);
        v.setQuantity(5);

        vehicleRepository.save(v);

        mockMvc.perform(get("/api/vehicles/search")
                        .param("model", "Fortuner")
                        .param("year", "2023"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.model == 'Fortuner' && @.year == 2023)]").exists());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    void shouldReturnAllVehiclesWhenNoFiltersProvided() throws Exception {

        Vehicle v = new Vehicle();
        v.setBrand("Maruti");
        v.setModel("Swift");
        v.setCategory("Hatchback");
        v.setYear(2022);
        v.setPrice(700000.0);
        v.setQuantity(8);

        vehicleRepository.save(v);

        mockMvc.perform(get("/api/vehicles/search"))
                .andExpect(status().isOk());
    }
}