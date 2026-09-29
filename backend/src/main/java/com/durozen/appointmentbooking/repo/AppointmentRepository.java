package com.durozen.appointmentbooking.repo;

import com.durozen.appointmentbooking.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> { }
