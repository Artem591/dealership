package com.dealership.Service;

import com.dealership.Entity.Lead;
import com.dealership.Entity.LeadStatus;
import com.dealership.Repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;

    public Page<Lead> getAllLeads(Pageable pageable) {
        return leadRepository.findAll(pageable);
    }

    public Lead getLeadById(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found: " + id));
    }

    @Transactional
    public Lead createLead(Lead lead) {
        return leadRepository.save(lead);
    }

    @Transactional
    public Lead updateLeadStatus(Long id, LeadStatus status) {
        Lead lead = getLeadById(id);
        lead.setStatus(status);
        return leadRepository.save(lead);
    }
}