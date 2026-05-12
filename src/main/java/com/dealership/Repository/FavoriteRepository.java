package com.dealership.Repository;

import com.dealership.Entity.Car;
import com.dealership.Entity.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    @Query("SELECT f.car FROM Favorite f WHERE f.user.id = :userId")
    Page<Car> findCarsByUserId(@Param("userId") Long userId, Pageable pageable);

    boolean existsByUserIdAndCarId(Long userId, Long carId);

    void deleteByUserIdAndCarId(Long userId, Long carId);
}