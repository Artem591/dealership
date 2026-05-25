package com.dealership.Controller;

import com.dealership.DTO.ApiResponse;
import com.dealership.Service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return ResponseEntity.ok(ApiResponse.success(favoriteService.getFavorites(pageable)));
    }

    @GetMapping("/cars/{carId}/status")
    public ResponseEntity<ApiResponse> checkStatus(@PathVariable Long carId) {
        return ResponseEntity.ok(ApiResponse.success(favoriteService.isFavorite(carId)));
    }
}