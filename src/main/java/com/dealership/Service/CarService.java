package com.dealership.Service;

import com.dealership.DTO.CarImageDTO;
import com.dealership.DTO.CarRequest;
import com.dealership.DTO.CarResponse;
import com.dealership.Entity.Car;
import com.dealership.Entity.CarImage;
import com.dealership.Entity.CarStatus;
import com.dealership.Mapper.CarMapper;
import com.dealership.Repository.CarImageRepository;
import com.dealership.Repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;
    private final CarMapper carMapper;
    private final CarImageRepository imageRepository;

    public Page<CarResponse> getAllCars(Pageable pageable) {
        return carRepository.findAll(pageable).map(car -> {
            CarResponse response = carMapper.toResponse(car);
            List<CarImage> images = imageRepository.findByCarIdOrderBySortOrder(car.getId());
            response.setImages(images.stream()
                    .map(carMapper::toImageDTO)
                    .collect(Collectors.toList()));
            return response;
        });
    }

    public Page<CarResponse> getAvailableCars(Pageable pageable) {
        return carRepository.findByStatus(CarStatus.AVAILABLE, pageable).map(car -> {
            CarResponse response = carMapper.toResponse(car);
            List<CarImage> images = imageRepository.findByCarIdOrderBySortOrder(car.getId());
            response.setImages(images.stream()
                    .map(carMapper::toImageDTO)
                    .collect(Collectors.toList()));
            return response;
        });
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

    public List<CarImageDTO> getCarImages(Long carId) {
        return imageRepository.findByCarIdOrderBySortOrder(carId)
                .stream()
                .map(carMapper::toImageDTO)
                .collect(Collectors.toList());
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