package com.dealership.Mapper;

import com.dealership.DTO.CarImageDTO;
import com.dealership.DTO.CarRequest;
import com.dealership.DTO.CarResponse;
import com.dealership.Entity.Car;
import com.dealership.Entity.CarImage;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CarMapper {

    Car toEntity(CarRequest request);

    CarResponse toResponse(Car car);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(CarRequest request, @MappingTarget Car car);

    CarImageDTO toImageDTO(CarImage carImage);
}