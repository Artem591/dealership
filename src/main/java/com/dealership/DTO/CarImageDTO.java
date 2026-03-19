package com.dealership.DTO;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarImageDTO {
    private Long id;
    private String imageUrl;
    private String imageType;
    private Integer sortOrder;
}