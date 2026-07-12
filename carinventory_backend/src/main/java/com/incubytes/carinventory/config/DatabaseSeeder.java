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
        vehicleRepository.save(createVehicle("Toyota", "Fortuner", "SUV", 2024, 52000.00, 8, "/images/fortuner.jpg"));
        vehicleRepository.save(createVehicle("Toyota", "Camry", "Sedan", 2024, 39000.00, 6, "/images/camry.jpg"));

        vehicleRepository.save(createVehicle("Honda", "City", "Sedan", 2023, 22000.00, 10, "/images/city.jpg"));
        vehicleRepository.save(createVehicle("Honda", "Civic", "Sedan", 2024, 31000.00, 5, "/images/civic.jpg"));

        vehicleRepository.save(createVehicle("Hyundai", "Creta", "SUV", 2024, 24000.00, 12, "/images/creta.jpg"));
        vehicleRepository.save(createVehicle("Hyundai", "Verna", "Sedan", 2024, 21000.00, 9, "/images/verna.jpg"));

        vehicleRepository.save(createVehicle("Mahindra", "Scorpio N", "SUV", 2024, 31000.00, 7, "/images/scorpio-n.jpg"));
        vehicleRepository.save(createVehicle("Mahindra", "XUV700", "SUV", 2024, 36000.00, 6, "/images/xuv700.jpg"));

        vehicleRepository.save(createVehicle("Tata", "Nexon", "SUV", 2024, 19000.00, 15, "/images/nexon.jpg"));
        vehicleRepository.save(createVehicle("Tata", "Harrier", "SUV", 2024, 32000.00, 8, "/images/harrier.jpg"));

        vehicleRepository.save(createVehicle("Kia", "Seltos", "SUV", 2024, 25000.00, 10, "/images/seltos.jpg"));
        vehicleRepository.save(createVehicle("MG", "Hector", "SUV", 2024, 29000.00, 5, "/images/hector.jpg"));

        vehicleRepository.save(createVehicle("BMW", "3 Series", "Luxury Sedan", 2024, 61000.00, 4, "/images/bmw-3-series.jpg"));
        vehicleRepository.save(createVehicle("BMW", "X5", "Luxury SUV", 2024, 85000.00, 3, "/images/bmw-x5.jpg"));

        vehicleRepository.save(createVehicle("Mercedes-Benz", "C-Class", "Luxury Sedan", 2024, 67000.00, 4, "/images/mercedes-c-class.jpg"));
        vehicleRepository.save(createVehicle("Mercedes-Benz", "GLC", "Luxury SUV", 2024, 72000.00, 3, "/images/mercedes-glc.jpg"));

        vehicleRepository.save(createVehicle("Audi", "A4", "Luxury Sedan", 2024, 58000.00, 5, "/images/audi-a4.jpg"));
        vehicleRepository.save(createVehicle("Audi", "Q7", "Luxury SUV", 2024, 89000.00, 2, "/images/audi-q7.jpg"));

        vehicleRepository.save(createVehicle("Tesla", "Model 3", "Electric Sedan", 2024, 47000.00, 9, "/images/tesla-model3.jpg"));
        vehicleRepository.save(createVehicle("Tesla", "Model Y", "Electric SUV", 2024, 53000.00, 7, "/images/tesla-modely.jpg"));
        System.out.println("Seeded 20 demo vehicles");
    }

    private Vehicle createVehicle(
            String brand,
            String model,
            String category,
            int year,
            double price,
            int quantity,
            String imageUrl) {

        Vehicle vehicle = new Vehicle();

        vehicle.setBrand(brand);
        vehicle.setModel(model);
        vehicle.setCategory(category);
        vehicle.setYear(year);
        vehicle.setPrice(price);
        vehicle.setQuantity(quantity);
        vehicle.setImageUrl(imageUrl);

        return vehicle;
    }
}
