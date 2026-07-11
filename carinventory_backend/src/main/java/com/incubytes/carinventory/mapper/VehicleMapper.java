package com.incubytes.carinventory.mapper;

import com.incubytes.carinventory.dto.VehicleRequest;
import com.incubytes.carinventory.dto.VehicleResponse;
import com.incubytes.carinventory.entity.Vehicle;

public class VehicleMapper {

    public static Vehicle toEntity(VehicleRequest request) {

        Vehicle vehicle = new Vehicle();

        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setCategory(request.getCategory());
        vehicle.setYear(request.getYear());
        vehicle.setPrice(request.getPrice());
        vehicle.setQuantity(request.getQuantity());

        return vehicle;
    }

    public static VehicleResponse toResponse(Vehicle vehicle) {

        VehicleResponse response = new VehicleResponse();

        response.setId(vehicle.getId());
        response.setBrand(vehicle.getBrand());
        response.setModel(vehicle.getModel());
        response.setCategory(vehicle.getCategory());
        response.setYear(vehicle.getYear());
        response.setPrice(vehicle.getPrice());
        response.setQuantity(vehicle.getQuantity());

        return response;
    }
}