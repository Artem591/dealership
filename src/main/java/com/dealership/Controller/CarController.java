package com.dealership.Controller;

import com.dealership.DTO.*;
import com.dealership.Entity.CarImage;
import com.dealership.Entity.User;
import com.dealership.Repository.CarImageRepository;
import com.dealership.Repository.UserRepository;
import com.dealership.Service.CarService;
import com.dealership.Service.FileStorageService;
import com.dealership.Service.LeadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;
    private final UserRepository userRepository;
    private final LeadService leadService;
    private final FileStorageService fileStorageService;
    private final CarImageRepository carImageRepository;


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

    @GetMapping("/{id}/images")
    public ResponseEntity<List<CarImageDTO>> getCarImages(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarImages(id));
    }

    @PostMapping("/{id}/lead")
    public ResponseEntity<ApiResponse> createLead(
            @PathVariable Long id,
            @RequestBody LeadRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        leadService.createLead(id, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Заявка успешно создана!"));
    }


    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<CarResponse> createCar(@Valid @RequestBody CarRequest request) {
        return ResponseEntity.ok(carService.createCar(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<CarResponse> updateCar(@PathVariable Long id,
                                                 @Valid @RequestBody CarRequest request) {
        return ResponseEntity.ok(carService.updateCar(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse> uploadCarImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "imageType", defaultValue = "gallery") String imageType,
            @RequestParam(value = "sortOrder", defaultValue = "0") Integer sortOrder) {

        String imageUrl = fileStorageService.storeFile(file);

        com.dealership.Entity.Car car = new com.dealership.Entity.Car();
        car.setId(id);

        CarImage image = CarImage.builder()
                .car(car)
                .imageUrl(imageUrl)
                .imageType(imageType)
                .sortOrder(sortOrder)
                .build();

        carImageRepository.save(image);
        return ResponseEntity.ok(ApiResponse.success("Изображение загружено", imageUrl));
    }

    @DeleteMapping("/{carId}/images/{imageId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse> deleteCarImage(@PathVariable Long carId,
                                                      @PathVariable Long imageId) {
        carImageRepository.findById(imageId).ifPresent(img -> {
            fileStorageService.deleteFile(img.getImageUrl());
            carImageRepository.deleteById(imageId);
        });
        return ResponseEntity.ok(ApiResponse.success("Изображение удалено"));
    }
}