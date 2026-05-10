package com.dealership.config;


import com.dealership.Entity.Role;
import com.dealership.Entity.User;
import com.dealership.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

    @Component
    @RequiredArgsConstructor
    public class DataInitializer implements CommandLineRunner {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) {
            // Создаём админа, если его нет
            if (!userRepository.existsByEmail("admin@autodealer.by")) {
                User admin = User.builder()
                        .email("admin@autodealer.by")
                        .passwordHash(passwordEncoder.encode("admin123"))  // Пароль: admin123
                        .firstName("Админ")
                        .lastName("Системный")
                        .phone("+375290000000")
                        .role(Role.ADMIN)
                        .isActive(true)
                        .build();
                userRepository.save(admin);
                System.out.println("✅ Админ создан: admin@autodealer.by / admin123");
            }
        }
    }

