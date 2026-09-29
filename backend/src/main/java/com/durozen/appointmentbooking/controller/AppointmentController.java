package com.durozen.appointmentbooking.controller;

import com.durozen.appointmentbooking.StatusRequest;
import com.durozen.appointmentbooking.entity.Appointment;
import com.durozen.appointmentbooking.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:1234")
public class AppointmentController {
    private final AppointmentService service;

    public AppointmentController(AppointmentService service) { this.service = service; }

    @GetMapping
    public List<Appointment> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public Appointment getById(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Appointment create(@Valid @RequestBody Appointment appointment) {
        return service.create(appointment);
    }

    @PutMapping("/{id}")
    public Appointment update(@PathVariable Long id, @Valid @RequestBody Appointment appointment) {
        return service.update(id, appointment);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }

    @PatchMapping("/{id}/status")
    public Appointment updateStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request) {
        return service.updateStatus(id, request.getStatus());
    }
}
