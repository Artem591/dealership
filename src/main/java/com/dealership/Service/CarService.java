package com.dealership.Service;

import com.dealership.DTO.CarRequest;
import com.dealership.DTO.CarResponse;
import com.dealership.Entity.Car;
import com.dealership.Entity.CarStatus;
import com.dealership.Mapper.CarMapper;
import com.dealership.Repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;
    private final CarMapper carMapper;

    public Page<CarResponse> getAllCars(Pageable pageable) {
        return carRepository.findAll(pageable).map(carMapper::toResponse);
    }

    public Page<CarResponse> getAvailableCars(Pageable pageable) {
        return carRepository.findByStatus(CarStatus.AVAILABLE, pageable)
                .map(carMapper::toResponse);
    }

    public Page<CarResponse> filterCars(String make, String model,
                                        BigDecimal minPrice, BigDecimal maxPrice,
                                        Integer year, Pageable pageable) {
        return carRepository.filterCars(make, model, minPrice, maxPrice, year, pageable)
                .map(carMapper::toResponse);
    }

    public CarResponse getCarById(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found: " + id));
        return carMapper.toResponse(car);
    }

    @Transactional
    public CarResponse createCar(CarRequest request) {
        if (carRepository.existsByVin(request.getVin())) {
            throw new RuntimeException("Car with VIN already exists: " + request.getVin());
        }
        Car car = carMapper.toEntity(request);
        car.setStatus(CarStatus.AVAILABLE);
        return carMapper.toResponse(carRepository.save(car));
    }

    @Transactional
    public CarResponse updateCar(Long id, CarRequest request) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found: " + id));
        carMapper.updateEntity(request, car);
        return carMapper.toResponse(carRepository.save(car));
    }

    @Transactional
    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }
}