package com.dealership.Service;

import com.dealership.Entity.Car;
import com.dealership.Entity.Favorite;
import com.dealership.Entity.User;
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

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final CarRepository carRepository;

    @Transactional
    public void toggleFavorite(Long carId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Автомобиль не найден"));

        if (favoriteRepository.existsByUserIdAndCarId(user.getId(), carId)) {
            favoriteRepository.deleteByUserIdAndCarId(user.getId(), carId);
        } else {
            Favorite favorite = Favorite.builder()
                    .user(user)
                    .car(car)
                    .createdAt(LocalDateTime.now())
                    .build();
            favoriteRepository.save(favorite);
        }
    }

    @Transactional(readOnly = true)
    public Page<Car> getFavorites(Pageable pageable) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        return favoriteRepository.findCarsByUserId(user.getId(), pageable);
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(Long carId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        return favoriteRepository.existsByUserIdAndCarId(user.getId(), carId);
    }
}