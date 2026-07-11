package com.incubytes.carinventory.controller;

import com.incubytes.carinventory.entity.Vehicle;
import com.incubytes.carinventory.service.VehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(service.getAllVehicles());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Vehicle>> searchVehicles(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                service.searchVehicles(keyword)
        );
    }
    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicle) {

        Vehicle updatedVehicle = service.updateVehicle(id, vehicle);

        return ResponseEntity.ok(updatedVehicle);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {

        service.deleteVehicle(id);

        return ResponseEntity.noContent().build();
    }
}