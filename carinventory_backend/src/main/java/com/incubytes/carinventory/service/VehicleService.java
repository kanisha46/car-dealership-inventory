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
    public Vehicle restockVehicle(Long id, int quantity) {

        if (quantity <= 0) {
            throw new IllegalArgumentException("Restock quantity must be positive");
        }

        Vehicle vehicle = repository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle not found"));

        vehicle.setQuantity(vehicle.getQuantity() + quantity);

        return repository.save(vehicle);
    }
    public List<Vehicle> searchByBrand(String brand) {
        return repository.findByBrandIgnoreCase(brand);
    }

    public List<Vehicle> searchByModel(String model) {
        return repository.findByModelIgnoreCase(model);
    }

    public List<Vehicle> filterByPrice(Double minPrice, Double maxPrice) {
        return repository.findByPriceBetween(minPrice, maxPrice);
    }

    public List<Vehicle> filterByYear(Integer year) {
        return repository.findByYear(year);
    }

    /**
     * Combined search that filters by any combination of brand, model, year and price range.
     * Any parameter that is null is ignored (acts as "no filter").
     */
    public List<Vehicle> searchWithFilters(String brand, String model, Integer year,
                                           Double minPrice, Double maxPrice) {
        return repository.searchWithFilters(brand, model, year, minPrice, maxPrice);
    }
}