package com.durozen.appointmentbooking;

import jakarta.validation.constraints.NotNull;

public class StatusRequest {
    @NotNull private AppointmentStatus status;
    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }
}
