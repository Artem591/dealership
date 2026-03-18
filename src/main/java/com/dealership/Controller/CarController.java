package com.dealership.Controller;

import com.dealership.DTO.ApiResponse;
import com.dealership.DTO.CarRequest;
import com.dealership.DTO.CarResponse;
import com.dealership.Service.CarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;

    @GetMapping
    public ResponseEntity<Page<CarResponse>> getAllCars(Pageable pageable) {
        return ResponseEntity.ok(carService.getAllCars(pageable));
    }

    @GetMapping("/available")
    public ResponseEntity<Page<CarResponse>> getAvailableCars(Pageable pageable) {
        return ResponseEntity.ok(carService.getAvailableCars(pageable));
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<CarResponse>> filterCars(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer year,
            Pageable pageable) {
        return ResponseEntity.ok(carService.filterCars(make, model, minPrice, maxPrice, year, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarResponse> getCar(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarById(id));
    }

    @PostMapping
    public ResponseEntity<CarResponse> createCar(@Valid @RequestBody CarRequest request) {
        return ResponseEntity.ok(carService.createCar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarResponse> updateCar(@PathVariable Long id, @Valid @RequestBody CarRequest request) {
        return ResponseEntity.ok(carService.updateCar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }
}