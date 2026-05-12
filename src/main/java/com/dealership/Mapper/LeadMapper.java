package com.dealership.Mapper;

import com.dealership.DTO.LeadResponse;
import com.dealership.Entity.Lead;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LeadMapper {

    @Mapping(source = "car.id", target = "carId")
    @Mapping(source = "car.make", target = "carMake")
    @Mapping(source = "car.model", target = "carModel")
    @Mapping(source = "client.id", target = "clientId")
    @Mapping(source = "client.firstName", target = "clientFirstName")
    @Mapping(source = "client.lastName", target = "clientLastName")
    @Mapping(source = "client.phone", target = "clientPhone")
    @Mapping(source = "client.email", target = "clientEmail")
    LeadResponse toResponse(Lead lead);
}