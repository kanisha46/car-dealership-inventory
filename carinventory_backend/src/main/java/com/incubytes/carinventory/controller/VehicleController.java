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

    /**
     * Unified search & filter endpoint.
     * All params are optional and can be combined freely:
     *   - brand:    partial, case-insensitive match on brand name
     *   - model:    partial, case-insensitive match on model name
     *   - year:     exact year match
     *   - minPrice: lower bound of price range (inclusive)
     *   - maxPrice: upper bound of price range (inclusive)
     *
     * When no params are provided, all vehicles are returned.
     */
    @GetMapping("/search")
    public ResponseEntity<List<VehicleResponse>> searchVehicles(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {

        List<Vehicle> vehicles = service.searchWithFilters(brand, model, year, minPrice, maxPrice);

        List<VehicleResponse> response = vehicles.stream()
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