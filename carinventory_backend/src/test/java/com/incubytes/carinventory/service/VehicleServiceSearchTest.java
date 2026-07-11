package com.incubytes.carinventory.service;

import com.incubytes.carinventory.entity.Vehicle;
import com.incubytes.carinventory.repository.VehicleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceSearchTest {

    @Mock
    private VehicleRepository repository;

    @InjectMocks
    private VehicleService vehicleService;

    // ─── Brand Search ────────────────────────────────────────────────────────

    @Test
    void shouldReturnVehiclesWhenSearchingByBrand() {
        Vehicle toyota = new Vehicle();
        toyota.setBrand("Toyota");
        toyota.setModel("Fortuner");
        toyota.setCategory("SUV");
        toyota.setYear(2023);
        toyota.setPrice(4200000.0);
        toyota.setQuantity(5);

        when(repository.findByBrandIgnoreCase("Toyota"))
                .thenReturn(List.of(toyota));

        List<Vehicle> result = vehicleService.searchByBrand("Toyota");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getBrand()).isEqualTo("Toyota");
        verify(repository).findByBrandIgnoreCase("Toyota");
    }

    @Test
    void shouldReturnEmptyListWhenBrandNotFound() {
        when(repository.findByBrandIgnoreCase("Unknown"))
                .thenReturn(List.of());

        List<Vehicle> result = vehicleService.searchByBrand("Unknown");

        assertThat(result).isEmpty();
    }

    // ─── Model Search ────────────────────────────────────────────────────────

    @Test
    void shouldReturnVehiclesWhenSearchingByModel() {
        Vehicle v = new Vehicle();
        v.setBrand("BMW");
        v.setModel("X5");
        v.setCategory("SUV");
        v.setYear(2024);
        v.setPrice(8000000.0);
        v.setQuantity(3);

        when(repository.findByModelIgnoreCase("X5"))
                .thenReturn(List.of(v));

        List<Vehicle> result = vehicleService.searchByModel("X5");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getModel()).isEqualTo("X5");
        verify(repository).findByModelIgnoreCase("X5");
    }

    @Test
    void shouldReturnEmptyListWhenModelNotFound() {
        when(repository.findByModelIgnoreCase("NonExistentModel"))
                .thenReturn(List.of());

        List<Vehicle> result = vehicleService.searchByModel("NonExistentModel");

        assertThat(result).isEmpty();
    }

    // ─── Price Range Filter ──────────────────────────────────────────────────

    @Test
    void shouldReturnVehiclesWithinPriceRange() {
        Vehicle v = new Vehicle();
        v.setBrand("Maruti");
        v.setModel("Swift");
        v.setCategory("Hatchback");
        v.setYear(2022);
        v.setPrice(700000.0);
        v.setQuantity(10);

        when(repository.findByPriceBetween(500000.0, 1000000.0))
                .thenReturn(List.of(v));

        List<Vehicle> result = vehicleService.filterByPrice(500000.0, 1000000.0);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getPrice()).isBetween(500000.0, 1000000.0);
        verify(repository).findByPriceBetween(500000.0, 1000000.0);
    }

    @Test
    void shouldReturnEmptyListWhenNoPriceRangeMatch() {
        when(repository.findByPriceBetween(1.0, 100.0))
                .thenReturn(List.of());

        List<Vehicle> result = vehicleService.filterByPrice(1.0, 100.0);

        assertThat(result).isEmpty();
    }

    // ─── Year Filter ─────────────────────────────────────────────────────────

    @Test
    void shouldReturnVehiclesForGivenYear() {
        Vehicle v = new Vehicle();
        v.setBrand("Honda");
        v.setModel("City");
        v.setCategory("Sedan");
        v.setYear(2022);
        v.setPrice(1200000.0);
        v.setQuantity(4);

        when(repository.findByYear(2022))
                .thenReturn(List.of(v));

        List<Vehicle> result = vehicleService.filterByYear(2022);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getYear()).isEqualTo(2022);
        verify(repository).findByYear(2022);
    }

    @Test
    void shouldReturnEmptyListWhenNoVehicleForYear() {
        when(repository.findByYear(1900))
                .thenReturn(List.of());

        List<Vehicle> result = vehicleService.filterByYear(1900);

        assertThat(result).isEmpty();
    }

    // ─── Combined Filter ─────────────────────────────────────────────────────

    @Test
    void shouldReturnVehiclesMatchingCombinedFilters() {
        Vehicle v = new Vehicle();
        v.setBrand("Toyota");
        v.setModel("Fortuner");
        v.setCategory("SUV");
        v.setYear(2023);
        v.setPrice(4200000.0);
        v.setQuantity(5);

        when(repository.searchWithFilters("Toyota", null, 2023, null, null))
                .thenReturn(List.of(v));

        List<Vehicle> result = vehicleService.searchWithFilters("Toyota", null, 2023, null, null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getBrand()).isEqualTo("Toyota");
        assertThat(result.get(0).getYear()).isEqualTo(2023);
        verify(repository).searchWithFilters("Toyota", null, 2023, null, null);
    }

    @Test
    void shouldReturnAllVehiclesWhenAllFiltersAreNull() {
        Vehicle v1 = new Vehicle();
        v1.setBrand("Toyota");
        v1.setModel("Fortuner");
        v1.setCategory("SUV");
        v1.setYear(2023);
        v1.setPrice(4200000.0);
        v1.setQuantity(5);

        Vehicle v2 = new Vehicle();
        v2.setBrand("BMW");
        v2.setModel("X5");
        v2.setCategory("SUV");
        v2.setYear(2024);
        v2.setPrice(8000000.0);
        v2.setQuantity(3);

        when(repository.searchWithFilters(null, null, null, null, null))
                .thenReturn(List.of(v1, v2));

        List<Vehicle> result = vehicleService.searchWithFilters(null, null, null, null, null);

        assertThat(result).hasSize(2);
        verify(repository).searchWithFilters(null, null, null, null, null);
    }

    @Test
    void shouldFilterByBrandAndPriceRangeCombined() {
        Vehicle v = new Vehicle();
        v.setBrand("BMW");
        v.setModel("X5");
        v.setCategory("SUV");
        v.setYear(2024);
        v.setPrice(8000000.0);
        v.setQuantity(3);

        when(repository.searchWithFilters("BMW", null, null, 5000000.0, 10000000.0))
                .thenReturn(List.of(v));

        List<Vehicle> result = vehicleService.searchWithFilters("BMW", null, null, 5000000.0, 10000000.0);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getBrand()).isEqualTo("BMW");
        assertThat(result.get(0).getPrice()).isBetween(5000000.0, 10000000.0);
        verify(repository).searchWithFilters("BMW", null, null, 5000000.0, 10000000.0);
    }
}
