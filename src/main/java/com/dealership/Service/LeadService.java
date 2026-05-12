package com.dealership.Service;

import com.dealership.DTO.LeadRequest;
import com.dealership.DTO.LeadResponse;
import com.dealership.Entity.*;
import com.dealership.Mapper.LeadMapper;
import com.dealership.Repository.CarRepository;
import com.dealership.Repository.LeadRepository;
import com.dealership.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final LeadMapper leadMapper;

    @Transactional(readOnly = true)
    public Page<LeadResponse> getAllLeads(Pageable pageable) {
        return leadRepository.findAll(pageable).map(leadMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<LeadResponse> getMyLeads(Pageable pageable) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User client = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        return leadRepository.findByClientId(client.getId(), pageable)
                .map(leadMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public LeadResponse getLeadById(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Заявка не найдена"));
        return leadMapper.toResponse(lead);
    }

    @Transactional
    public void createLead(Long carId, Long userId, LeadRequest request) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Автомобиль не найден"));
        User client = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Lead lead = Lead.builder()
                .car(car)
                .client(client)
                .type(request.getType())
                .comment(request.getComment())
                .source("SITE")
                .status(LeadStatus.NEW)
                .createdAt(LocalDateTime.now())
                .build();

        leadRepository.save(lead);
    }

    @Transactional
    public void updateStatus(Long leadId, LeadStatus newStatus) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Заявка не найдена"));
        lead.setStatus(newStatus);
        lead.setUpdatedAt(LocalDateTime.now());
        leadRepository.save(lead);
    }
}