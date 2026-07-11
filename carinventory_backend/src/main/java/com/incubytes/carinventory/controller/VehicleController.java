package com.incubytes.carinventory.controller;

import com.incubytes.carinventory.entity.Vehicle;
import com.incubytes.carinventory.service.VehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.incubytes.carinventory.dto.VehicleRequest;
import com.incubytes.carinventory.dto.VehicleResponse;
import com.incubytes.carinventory.mapper.VehicleMapper;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService service;

    public VehicleController(VehicleService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<VehicleResponse> createVehicle(
            @Valid @RequestBody VehicleRequest request) {

        Vehicle vehicle = VehicleMapper.toEntity(request);

        Vehicle savedVehicle = service.createVehicle(vehicle);

        VehicleResponse response = VehicleMapper.toResponse(savedVehicle);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAllVehicles() {

        List<VehicleResponse> response = service.getAllVehicles()
                .stream()
                .map(VehicleMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<VehicleResponse>> searchVehicles(
            @RequestParam String keyword) {

        List<VehicleResponse> response = service.searchVehicles(keyword)
                .stream()
                .map(VehicleMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> updateVehicle(
            @PathVariable Long id,
            @RequestBody VehicleRequest request) {

        Vehicle vehicle = VehicleMapper.toEntity(request);

        Vehicle updatedVehicle = service.updateVehicle(id, vehicle);

        VehicleResponse response = VehicleMapper.toResponse(updatedVehicle);

        return ResponseEntity.ok(response);
    }
    @PostMapping("/{id}/purchase")
    public ResponseEntity<VehicleResponse> purchaseVehicle(
            @PathVariable Long id) {

        Vehicle vehicle = service.purchaseVehicle(id);

        return ResponseEntity.ok(
                VehicleMapper.toResponse(vehicle)
        );
    }
    @PostMapping("/{id}/restock")
    public ResponseEntity<VehicleResponse> restockVehicle(
            @PathVariable Long id,
            @RequestParam int quantity) {

        Vehicle vehicle = service.restockVehicle(id, quantity);

        return ResponseEntity.ok(
                VehicleMapper.toResponse(vehicle)
        );
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {

        service.deleteVehicle(id);

        return ResponseEntity.noContent().build();
    }
}