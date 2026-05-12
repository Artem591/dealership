package com.dealership.Controller;

import com.dealership.DTO.ApiResponse;
import com.dealership.Service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.dealership.Entity.Car;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/cars/{carId}")
    public ResponseEntity<ApiResponse> toggleFavorite(@PathVariable Long carId) {
        favoriteService.toggleFavorite(carId);
        return ResponseEntity.ok(ApiResponse.success("Список избранного обновлён"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getFavorites(Pageable pageable) {
        Page<Car> favorites = favoriteService.getFavorites(pageable);
        return ResponseEntity.ok(ApiResponse.success(favorites));
    }

    @GetMapping("/cars/{carId}/status")
    public ResponseEntity<ApiResponse> checkStatus(@PathVariable Long carId) {
        boolean isFav = favoriteService.isFavorite(carId);
        return ResponseEntity.ok(ApiResponse.success(isFav));
    }
}