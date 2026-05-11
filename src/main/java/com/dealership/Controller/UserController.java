package com.dealership.Controller;

import com.dealership.DTO.ApiResponse;
import com.dealership.DTO.UserRequest;
import com.dealership.DTO.UserResponse;
import com.dealership.Entity.User;
import com.dealership.Service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getCurrentUser() {
        return ResponseEntity.ok(ApiResponse.success(userService.getCurrentUser()));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse> updateCurrentUser(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Профиль обновлен", userService.updateCurrentUser(request)));
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }
}