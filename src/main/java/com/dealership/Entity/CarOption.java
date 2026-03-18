package com.dealership.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "car_options")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    @Column(name = "option_name", nullable = false)
    private String optionName;

    @Column(name = "option_value")
    private String optionValue;
}