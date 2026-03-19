package com.dealership.Repository;

import com.dealership.Entity.CarImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CarImageRepository extends JpaRepository<CarImage, Long> {
    List<CarImage> findByCarIdOrderBySortOrder(Long carId);
    List<CarImage> findByCarIdAndImageTypeOrderBySortOrder(Long carId, String imageType);
}