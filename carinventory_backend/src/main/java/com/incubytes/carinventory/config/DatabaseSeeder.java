package com.incubytes.carinventory.config;

import com.incubytes.carinventory.entity.Role;
import com.incubytes.carinventory.entity.User;
import com.incubytes.carinventory.entity.Vehicle;
import com.incubytes.carinventory.repository.UserRepository;
import com.incubytes.carinventory.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository,
                          VehicleRepository vehicleRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Users
        if (userRepository.count() == 0) {
            User user = new User(
                    "Standard User",
                    "user@dealership.com",
                    passwordEncoder.encode("password123"),
                    Role.USER
            );
            userRepository.save(user);

            User admin = new User(
                    "Admin User",
                    "admin@dealership.com",
                    passwordEncoder.encode("password123"),
                    Role.ADMIN
            );
            userRepository.save(admin);
            System.out.println("Seeded default users: user@dealership.com and admin@dealership.com");
        }

        // Seed Vehicles
        if (vehicleRepository.count() == 0) {
            vehicleRepository.save(createVehicle("Tesla", "Model S", "Electric Sedan", 2023, 89990.00, 5));
            vehicleRepository.save(createVehicle("Tesla", "Model Y", "Electric SUV", 2024, 49990.00, 12));
            vehicleRepository.save(createVehicle("Ford", "Mustang Mach-E", "Electric SUV", 2023, 45990.00, 0)); // Out of stock
            vehicleRepository.save(createVehicle("Porsche", "911 Carrera", "Sports Car", 2024, 114400.00, 3));
            vehicleRepository.save(createVehicle("Toyota", "RAV4 Prime", "PHEV Crossover", 2023, 43000.00, 8));
            System.out.println("Seeded default vehicles");
        }
    }

    private Vehicle createVehicle(String brand, String model, String category, int year, double price, int quantity) {
        Vehicle vehicle = new Vehicle();
        vehicle.setBrand(brand);
        vehicle.setModel(model);
        vehicle.setCategory(category);
        vehicle.setYear(year);
        vehicle.setPrice(price);
        vehicle.setQuantity(quantity);
        return vehicle;
    }
}
