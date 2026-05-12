package com.dealership.Controller;

import com.dealership.DTO.ApiResponse;
import com.dealership.DTO.LeadResponse;
import com.dealership.Entity.LeadStatus;
import com.dealership.Service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse> getAllLeads(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(leadService.getAllLeads(pageable)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse> getMyLeads(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(leadService.getMyLeads(pageable)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse> updateLeadStatus(
            @PathVariable Long id,
            @RequestParam LeadStatus status) {
        leadService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Статус заявки обновлён"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(leadService.getLeadById(id)));
    }
}