package com.dealership.Repository;

import com.dealership.Entity.Car;
import com.dealership.Entity.CarStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    Page<Car> findByStatus(CarStatus status, Pageable pageable);
    Optional<Car> findByVin(String vin);
    boolean existsByVin(String vin);

    @Query("SELECT c FROM Car c WHERE c.status = 'AVAILABLE' AND " +
            "(:make IS NULL OR LOWER(c.make) = LOWER(:make)) AND " +
            "(:model IS NULL OR LOWER(c.model) LIKE LOWER(CONCAT('%', :model, '%'))) AND " +
            "(:minPrice IS NULL OR c.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR c.price <= :maxPrice) AND " +
            "(:year IS NULL OR c.year >= :year)")
    Page<Car> filterCars(@Param("make") String make,
                         @Param("model") String model,
                         @Param("minPrice") BigDecimal minPrice,
                         @Param("maxPrice") BigDecimal maxPrice,
                         @Param("year") Integer year,
                         Pageable pageable);
}