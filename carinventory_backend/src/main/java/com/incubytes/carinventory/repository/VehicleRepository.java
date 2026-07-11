package com.incubytes.carinventory.repository;

import com.incubytes.carinventory.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByBrandContainingIgnoreCaseOrModelContainingIgnoreCaseOrCategoryContainingIgnoreCase(
            String brand,
            String model,
            String category
    );

    List<Vehicle> findByPriceBetween(Double minPrice, Double maxPrice);

    List<Vehicle> findByBrandIgnoreCase(String brand);

    List<Vehicle> findByModelIgnoreCase(String model);

    List<Vehicle> findByYear(Integer year);

    /**
     * Combined search query supporting optional filters for brand, model, year
     * and price range all at once.
     */
    @Query("SELECT v FROM Vehicle v WHERE " +
            "(:brand IS NULL OR LOWER(v.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) AND " +
            "(:model IS NULL OR LOWER(v.model) LIKE LOWER(CONCAT('%', :model, '%'))) AND " +
            "(:year IS NULL OR v.year = :year) AND " +
            "(:minPrice IS NULL OR v.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR v.price <= :maxPrice)")
    List<Vehicle> searchWithFilters(
            @Param("brand") String brand,
            @Param("model") String model,
            @Param("year") Integer year,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );
}