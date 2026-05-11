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
            if (!userRepository.existsByEmail("admin@autodealer.by")) {
                User admin = User.builder()
                        .email("admin@autodealer.by")
                        .passwordHash(passwordEncoder.encode("admin123"))
                        .firstName("Админ")
                        .lastName("Системный")
                        .phone("+375290000000")
                        .role(Role.ADMIN)
                        .isActive(true)
                        .build();
                userRepository.save(admin);
                System.out.println("✅ Админ создан: admin@autodealer.by / admin123");
            }
            if (!userRepository.existsByEmail("manager@autodealer.by")) {
                User manager = User.builder()
                        .email("manager@autodealer.by")
                        .passwordHash(passwordEncoder.encode("manager123"))
                        .firstName("Анна")
                        .lastName("Сидорова")
                        .phone("+375291234567")
                        .role(Role.MANAGER)
                        .isActive(true)
                        .build();
                userRepository.save(manager);
                System.out.println("✅ Менеджер создан: manager@autodealer.by / manager123");
            }

            if (!userRepository.existsByEmail("client@autodealer.by")) {
                User client = User.builder()
                        .email("client@autodealer.by")
                        .passwordHash(passwordEncoder.encode("client123"))
                        .firstName("Иван")
                        .lastName("Петров")
                        .phone("+375299876543")
                        .role(Role.CLIENT)
                        .isActive(true)
                        .build();
                userRepository.save(client);
                System.out.println("✅ Клиент создан: client@autodealer.by / client123");
            }
        }
    }

