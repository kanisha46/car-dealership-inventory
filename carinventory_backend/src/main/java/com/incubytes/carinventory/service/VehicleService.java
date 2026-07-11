package com.incubytes.carinventory.service;

import com.incubytes.carinventory.entity.Vehicle;
import com.incubytes.carinventory.exception.VehicleNotFoundException;
import com.incubytes.carinventory.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository repository;

    public VehicleService(VehicleRepository repository) {
        this.repository = repository;
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        return repository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return repository.findAll();
    }

    public List<Vehicle> searchVehicles(String keyword) {
        return repository
                .findByBrandContainingIgnoreCaseOrModelContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                        keyword,
                        keyword,
                        keyword
                );
    }

    public Vehicle updateVehicle(Long id, Vehicle updatedVehicle) {

        Vehicle existingVehicle = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        existingVehicle.setBrand(updatedVehicle.getBrand());
        existingVehicle.setModel(updatedVehicle.getModel());
        existingVehicle.setCategory(updatedVehicle.getCategory());
        existingVehicle.setYear(updatedVehicle.getYear());
        existingVehicle.setPrice(updatedVehicle.getPrice());
        existingVehicle.setQuantity(updatedVehicle.getQuantity());

        return repository.save(existingVehicle);
    }
    public void deleteVehicle(Long id) {

        if (!repository.existsById(id)) {
            throw new VehicleNotFoundException("Vehicle not found");
        }

        repository.deleteById(id);
    }
    public Vehicle purchaseVehicle(Long id) {

        Vehicle vehicle = repository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle not found"));

        if (vehicle.getQuantity() <= 0) {
            throw new IllegalStateException("Vehicle out of stock");
        }

        vehicle.setQuantity(vehicle.getQuantity() - 1);

        return repository.save(vehicle);
    }
}