package com.dealership.DTO;

import com.dealership.Entity.LeadType;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadRequest {

    @NotNull(message = "Car ID required")
    private Long carId;

    @NotNull(message = "Type required")
    private LeadType type;

    private String source;
    private String comment;
}