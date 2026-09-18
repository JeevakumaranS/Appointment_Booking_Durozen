package com.durozen.appointmentbooking;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    public List<Appointment> getAll() {
        return repository.findAll();
    }

    public Appointment getById(Long id) {
        return findAppointment(id);
    }

    public Appointment create(Appointment appointment) {
        appointment.setStatus(AppointmentStatus.PENDING);
        return repository.save(appointment);
    }

    public Appointment update(Long id, Appointment request) {
        Appointment appointment = findAppointment(id);
        appointment.setPatientName(request.getPatientName());
        appointment.setEmail(request.getEmail());
        appointment.setPhone(request.getPhone());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setReason(request.getReason());
        return repository.save(appointment);
    }

    public void delete(Long id) {
        repository.delete(findAppointment(id));
    }

    public Appointment updateStatus(Long id, AppointmentStatus requestedStatus) {
        if (requestedStatus == null) {
            throw new InvalidAppointmentStatusException("A status is required.");
        }

        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException(id));

        if (appointment.getStatus() == requestedStatus) {
            throw new InvalidAppointmentStatusException("The appointment already has this status.");
        }

        appointment.setStatus(requestedStatus);
        return repository.save(appointment);
    }

    private Appointment findAppointment(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException(id));
    }

}