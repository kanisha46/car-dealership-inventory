package com.incubytes.carinventory.repository;

import com.incubytes.carinventory.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByBrandContainingIgnoreCaseOrModelContainingIgnoreCaseOrCategoryContainingIgnoreCase(
            String brand,
            String model,
            String category
    );
}