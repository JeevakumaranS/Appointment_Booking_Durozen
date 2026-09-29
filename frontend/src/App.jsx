import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentRoutes from "./components/AppointmentRoutes";
import { login as loginUser } from "./api/authApi";
import { TOKEN_KEY } from "./api/client";
import {
  createAppointment,
  deleteAppointment as deleteAppointmentRequest,
  getAppointments,
  updateAppointment,
  updateAppointmentStatus,
} from "./api/appointmentApi";
const USERNAME_KEY = "appointment_username";

function getTokenExpiration(token) {
  if (!token) return null;

  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return null;

    const base64Payload = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload =
      base64Payload + "=".repeat((4 - (base64Payload.length % 4)) % 4);
    const payload = JSON.parse(atob(paddedPayload));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function hasValidToken() {
  const expiration = getTokenExpiration(localStorage.getItem(TOKEN_KEY));
  return Boolean(expiration && expiration > Date.now());
}

const emptyForm = {
  patientName: "",
  email: "",
  phone: "",
  appointmentDate: "",
  reason: "",
};

export default function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(hasValidToken);
  const [loggedInUsername, setLoggedInUsername] = useState(
    () => localStorage.getItem(USERNAME_KEY) || "",
  );
  const [form, setForm] = useState(emptyForm);
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const expiration = getTokenExpiration(localStorage.getItem(TOKEN_KEY));
    if (!expiration || expiration <= Date.now()) {
      logout("expired");
      return undefined;
    }

    const timeoutId = window.setTimeout(
      () => logout("expired"),
      expiration - Date.now(),
    );
    return () => window.clearTimeout(timeoutId);
  }, [isAuthenticated]);

  async function login(loginForm) {
    setMessage("");

    try {
      const response = await loginUser(loginForm.username, loginForm.password);
      const result = response.data;
      localStorage.setItem(TOKEN_KEY, result.access_token);
      localStorage.setItem(USERNAME_KEY, result.username);
      setLoggedInUsername(result.username);
      setIsAuthenticated(true);
      navigate("/appointments");
      return null;
    } catch (error) {
      if (error.response?.status === 401) {
        return "Incorrect username or password.";
      }
      return error.message;
    }
  }

  async function loadAppointments() {
    try {
      const response = await getAppointments();
      setAppointments(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        logout("expired");
        return;
      }
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function saveAppointment(event, appointmentId) {
    event.preventDefault();
    setMessage("");

    try {
      if (appointmentId) {
        await updateAppointment(appointmentId, form);
      } else {
        await createAppointment(form);
      }

      setForm(emptyForm);
      navigate("/appointments");
      await loadAppointments();
    } catch (error) {
      if (error.response?.status === 401) {
        logout("expired");
        return;
      }
      if (error.response?.data) {
        const message =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data?.detail;
        error.message = message || error.message;
      }
      setMessage(error.message);
    }
  }

  async function changeStatus(id, status) {
    try {
      await updateAppointmentStatus(id, status);
      await loadAppointments();
    } catch (error) {
      if (error.response?.status === 401) {
        logout("expired");
        return;
      }
      setMessage(error.message);
    }
  }

  async function deleteAppointment(id) {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      await deleteAppointmentRequest(id);
      setMessage("Appointment deleted.");
      await loadAppointments();
    } catch (error) {
      if (error.response?.status === 401) {
        logout("expired");
        return;
      }
      setMessage(error.message);
    }
  }

  function logout(reason = "manual") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    setIsAuthenticated(false);
    if (reason === "expired") {
      window.alert("Your session has expired. Please log in again.");
    }
    setLoggedInUsername("");
    setForm(emptyForm);
    setMessage("");
    navigate("/login");
  }

  return (
    <AppointmentRoutes
      isAuthenticated={isAuthenticated}
      loggedInUsername={loggedInUsername}
      appointments={appointments}
      loading={loading}
      message={message}
      form={form}
      setForm={setForm}
      setMessage={setMessage}
      onLogin={login}
      onLogout={logout}
      onSubmit={saveAppointment}
      onChange={updateForm}
      onChangeStatus={changeStatus}
      onDelete={deleteAppointment}
    />
  );
}
