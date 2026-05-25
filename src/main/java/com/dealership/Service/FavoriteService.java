package com.dealership.Service;

import com.dealership.DTO.CarResponse;
import com.dealership.Entity.Car;
import com.dealership.Entity.CarImage;
import com.dealership.Entity.Favorite;
import com.dealership.Entity.User;
import com.dealership.Mapper.CarMapper;
import com.dealership.Repository.CarImageRepository;
import com.dealership.Repository.CarRepository;
import com.dealership.Repository.FavoriteRepository;
import com.dealership.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository  favoriteRepository;
    private final UserRepository      userRepository;
    private final CarRepository       carRepository;
    private final CarMapper           carMapper;
    private final CarImageRepository  imageRepository;

    @Transactional
    public void toggleFavorite(Long carId) {
        User user = currentUser();
        Car  car  = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Автомобиль не найден"));

        if (favoriteRepository.existsByUserIdAndCarId(user.getId(), carId)) {
            favoriteRepository.deleteByUserIdAndCarId(user.getId(), carId);
        } else {
            favoriteRepository.save(
                    Favorite.builder()
                            .user(user)
                            .car(car)
                            .createdAt(LocalDateTime.now())
                            .build()
            );
        }
    }

    @Transactional(readOnly = true)
    public Page<CarResponse> getFavorites(Pageable pageable) {
        User user = currentUser();
        return favoriteRepository.findCarsByUserId(user.getId(), pageable)
                .map(car -> {
                    CarResponse response = carMapper.toResponse(car);
                    List<CarImage> images = imageRepository.findByCarIdOrderBySortOrder(car.getId());
                    response.setImages(
                            images.stream().map(carMapper::toImageDTO).collect(Collectors.toList())
                    );
                    return response;
                });
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(Long carId) {
        return favoriteRepository.existsByUserIdAndCarId(currentUser().getId(), carId);
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
    }
}