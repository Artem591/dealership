package com.dealership.DTO;

import com.dealership.Entity.Role;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String phone;
    private String firstName;
    private String lastName;
    private Role role;
    private Boolean isActive;
    private LocalDateTime createdAt;
}