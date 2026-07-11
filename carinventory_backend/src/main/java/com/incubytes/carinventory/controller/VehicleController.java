package com.incubytes.carinventory.controller;

import com.incubytes.carinventory.entity.Vehicle;
import com.incubytes.carinventory.service.VehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {

    private final VehicleService service;

    public VehicleController(VehicleService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {

        Vehicle savedVehicle = service.createVehicle(vehicle);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedVehicle);
    }
}