package com.dealership.Controller;

import com.dealership.DTO.ApiResponse;
import com.dealership.Entity.Role;
import com.dealership.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse> updateUserRole(
            @PathVariable Long id,
            @RequestParam Role newRole) {
        userService.updateUserRole(id, newRole);
        return ResponseEntity.ok(ApiResponse.success("Роль обновлена"));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("Пользователь удалён"));
    }


    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getStats() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAdminStats()));
    }
}
