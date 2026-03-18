package com.dealership.DTO;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarRequest {

    @NotBlank(message = "VIN required")
    @Size(min = 17, max = 17)
    private String vin;

    @NotBlank(message = "Make required")
    private String make;

    @NotBlank(message = "Model required")
    private String model;

    @NotNull(message = "Year required")
    @Min(1900)
    private Integer year;

    @NotNull(message = "Price required")
    @DecimalMin("0.01")
    private BigDecimal price;

    private Integer mileage;
    private String fuelType;
    private String transmission;
    private String color;
    private String bodyType;
    private BigDecimal engineVolume;
    private Integer power;
    private String description;
    private Boolean isNew;
}