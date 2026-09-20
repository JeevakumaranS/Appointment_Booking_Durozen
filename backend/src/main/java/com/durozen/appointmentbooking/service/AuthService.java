package com.durozen.appointmentbooking;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(AuthRequest request) {
        String username = request.getUsername().trim();
        if (userRepository.existsByUsername(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists.");
        }

        User user = new User(username, passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        return new AuthResponse("User created successfully.", username);
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername().trim())
                .orElseThrow(() -> invalidCredentials());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw invalidCredentials();
        }

        return new AuthResponse("Login successful.", user.getUsername());
    }

    private ResponseStatusException invalidCredentials() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password.");
    }
}
