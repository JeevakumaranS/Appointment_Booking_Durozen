import apiClient from "./client";

export function login(username, password) {
  return apiClient.post("/auth/login", { username, password });
}
