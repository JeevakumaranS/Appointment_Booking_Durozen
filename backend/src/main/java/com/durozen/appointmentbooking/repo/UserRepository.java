package com.durozen.appointmentbooking.repo;

import java.util.Optional;

import com.durozen.appointmentbooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    Optional<User> findByUsername(String username);
}
