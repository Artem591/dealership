package com.dealership.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cars")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 17)
    private String vin;

    private String make;
    private String model;
    private Integer year;

    @Column(precision = 12, scale = 2)
    private BigDecimal price;

    private Integer mileage;

    @Column(name = "fuel_type")
    private String fuelType;

    private String transmission;
    private String color;

    @Column(name = "body_type")
    private String bodyType;

    @Column(name = "engine_volume")
    private BigDecimal engineVolume;

    private Integer power;

    @Enumerated(EnumType.STRING)
    private CarStatus status; // AVAILABLE, RESERVED, SOLD

    @Column(name = "is_new")
    private Boolean isNew = true;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CarImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    @Builder.Default
    private List<CarOption> options = new ArrayList<>();

    @PrePersist
    @PreUpdate
    protected void updateTimestamps() {
        updatedAt = LocalDateTime.now();
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}