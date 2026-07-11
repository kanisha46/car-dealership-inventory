package com.incubytes.carinventory.repository;

import com.incubytes.carinventory.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
}