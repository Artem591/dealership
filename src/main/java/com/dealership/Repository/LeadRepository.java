package com.dealership.Repository;

import com.dealership.Entity.Lead;
import com.dealership.Entity.LeadStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    Page<Lead> findByManagerId(Long managerId, Pageable pageable);
    Page<Lead> findByClientId(Long clientId, Pageable pageable);
    Page<Lead> findByStatus(LeadStatus status, Pageable pageable);
    List<Lead> findByCarId(Long carId);
    Page<Lead> findByClientIdAndStatus(Long clientId, LeadStatus status, Pageable pageable);
}