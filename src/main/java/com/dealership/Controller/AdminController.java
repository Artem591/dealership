package com.dealership.Controller;

import com.dealership.DTO.ApiResponse;
import com.dealership.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")  // Только для ADMIN
public class AdminController {

    private final UserService userService;

    // Получить всех пользователей
    @GetMapping("/users")
    public ResponseEntity<ApiResponse> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    // Изменить роль пользователя
    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse> updateUserRole(
            @PathVariable Long id,
            @RequestParam Role newRole) {
        userService.updateUserRole(id, newRole);
        return ResponseEntity.ok(ApiResponse.success("Роль обновлена"));
    }

    // Удалить пользователя
    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("Пользователь удалён"));
    }

    // Статистика
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getStats() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAdminStats()));
    }
}
