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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LeadService {
    private final LeadRepository leadRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final LeadMapper leadMapper;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public Page<LeadResponse> getAllLeads(Pageable pageable) {
        Pageable sortedByNewest = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return leadRepository.findAll(sortedByNewest).map(leadMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<LeadResponse> getMyLeads(Pageable pageable) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User client = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Pageable sortedByNewest = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return leadRepository.findByClientId(client.getId(), sortedByNewest)
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

        Map<String, Object> notification = new HashMap<>();
        notification.put("leadId", lead.getId());
        notification.put("carId", car.getId());
        notification.put("carMakeModel", car.getMake() + " " + car.getModel());
        notification.put("clientName", client.getFirstName() + " " + client.getLastName());
        notification.put("timestamp", LocalDateTime.now());

        messagingTemplate.convertAndSend("/topic/leads/new", (Object) notification);
    }

    @Transactional
    public void updateStatus(Long leadId, LeadStatus newStatus) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Заявка не найдена"));

        lead.setStatus(newStatus);
        lead.setUpdatedAt(LocalDateTime.now());
        Lead updated = leadRepository.save(lead);

        Map<String, Object> notification = new HashMap<>();
        notification.put("leadId", updated.getId());
        notification.put("newStatus", newStatus.name());
        notification.put("timestamp", LocalDateTime.now());

        String clientEmail = updated.getClient().getEmail();
        messagingTemplate.convertAndSendToUser(
                clientEmail,
                "/queue/lead-updates",
                (Object) notification
        );
    }
}