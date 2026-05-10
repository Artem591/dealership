package com.dealership.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

    public class AuthRequest {

        @NotBlank(message = "Email required")
        @Email(message = "Invalid email")
        private String email;

        @NotBlank(message = "Password required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String firstName;
        private String lastName;
        private String phone;
    }

