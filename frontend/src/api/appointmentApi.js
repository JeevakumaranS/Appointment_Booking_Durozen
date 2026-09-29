import apiClient from "./client";

export function getAppointments() {
  return apiClient.get("/appointments");
}

export function getAppointment(id) {
  return apiClient.get(`/appointments/${id}`);
}

export function createAppointment(data) {
  return apiClient.post("/appointments", data);
}

export function updateAppointment(id, data) {
  return apiClient.put(`/appointments/${id}`, data);
}

export function updateAppointmentStatus(id, status) {
  return apiClient.patch(`/appointments/${id}/status`, { status });
}

export function deleteAppointment(id) {
  return apiClient.delete(`/appointments/${id}`);
}
