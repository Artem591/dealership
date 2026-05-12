package com.dealership.DTO;

import com.dealership.Entity.LeadStatus;
import com.dealership.Entity.LeadType;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadResponse {
    private Long id;
    private Long carId;
    private String carMake;
    private String carModel;
    private Long clientId;
    private String clientFirstName;
    private String clientLastName;
    private String clientPhone;
    private String clientEmail;
    private LeadType type;
    private String comment;
    private String source;
    private LeadStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}