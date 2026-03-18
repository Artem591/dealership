package com.dealership.DTO;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadResponse {
    private Long id;
    private Long clientId;
    private String clientName;
    private Long managerId;
    private String managerName;
    private Long carId;
    private String carInfo;
    private String type;
    private String status;
    private String source;
    private String comment;
    private LocalDateTime createdAt;
}