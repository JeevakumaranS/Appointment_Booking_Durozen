import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/appointments";
const LOGIN_URL = "http://localhost:8080/api/auth/login";

const emptyForm = {
  patientName: "",
  email: "",
  phone: "",
  appointmentDate: "",
  reason: ""
};

const emptyLogin = {
  username: "",
  password: ""
};

export default function App() {
  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("add");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
    }
  }, [isAuthenticated]);

  function updateLoginForm(event) {
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
  }

  async function login(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Login failed.");
      }

      const result = await response.json();
      setLoggedInUsername(result.username);
      setLoginForm(emptyLogin);
      setIsAuthenticated(true);
    } catch (error) {
      setMessage(error.message);
    }
  }

  //console.log("render");

  async function loadAppointments() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load appointments.");
      setAppointments(await response.json());
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function saveAppointment(event) {
    event.preventDefault();
    setMessage("");

    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Appointment could not be saved.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setCurrentPage("list");
      await loadAppointments();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function editAppointment(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error("Could not load the appointment.");
      const appointment = await response.json();
      setForm({
        patientName: appointment.patientName,
        email: appointment.email,
        phone: appointment.phone,
        appointmentDate: appointment.appointmentDate,
        reason: appointment.reason
      });
      setEditingId(appointment.id);
      setMessage("");
      setCurrentPage("add");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function changeStatus(id, status) {
    try {
      //console.log("inside change status");
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error("Appointment status could not be updated.");
      await loadAppointments();
    } catch (error) {
      setMessage(error.message);
    }
  }
  
  async function deleteAppointment(id) {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Appointment could not be deleted.");
      setMessage("Appointment deleted.");
      await loadAppointments();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function logout() {
    setIsAuthenticated(false);
    setLoggedInUsername("");
    setForm(emptyForm);
    setEditingId(null);
    setCurrentPage("add");
    setMessage("");
  }

  if (!isAuthenticated) {
    return (
      <main>
        <header>
          <p className="eyebrow">APPOINTMENT BOOKING</p>
          <h1>Login</h1>
        </header>

        <section className="booking-card auth-card">
          <form onSubmit={login}>
            <label>
              Username
              <input
                name="username"
                value={loginForm.username}
                onChange={updateLoginForm}
                autoComplete="username"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={updateLoginForm}
                autoComplete="current-password"
                required
              />
            </label>

            <button type="submit">Login</button>
          </form>

          {message && <p className="message error-message">{message}</p>}
          <p className="auth-note">User accounts are created through the backend registration API.</p>
        </section>
      </main>
    );
  }
  
  if (currentPage === "list") {
    return (
      <main>
        <header>
          <div className="page-header">
            <div>
              <p className="eyebrow">BOOKING</p>
              <h1>Appointment List</h1>
              <p>Signed in as {loggedInUsername}</p>
            </div>
            <button className="secondary" onClick={logout}>Logout</button>
          </div>
        </header>

        <section className="appointments">
          <div className="section-title">
            <h2>Saved appointments</h2>
            <button className="secondary" onClick={() => setCurrentPage("add")}>Add new</button>
          </div>
          {message && <p className="message">{message}</p>}

          {loading ? (
            <p>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p>No appointments yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((item) => (
                    <tr key={item.id}>
                      <td>{item.patientName}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.appointmentDate}</td>
                      <td>{item.reason}</td>
                      <td>
                        <button
                          className={`status-button ${item.status.toLowerCase()}`}
                          onClick={() => changeStatus(
                            item.id,
                            item.status === "PENDING" ? "CONFIRMED" : "PENDING"
                          )}
                        >
                          {item.status}
                        </button>
                      </td>
                      <td className="actions">
                        <button className="secondary" onClick={() => editAppointment(item.id)}>Edit</button>
                        <button className="cancel" onClick={() => deleteAppointment(item.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main>
      <header className="page-header">
        <div>
          <p className="eyebrow">EASY SCHEDULING</p>
          <h1>{editingId ? "Edit Appointment" : "Add Appointment"}</h1>
        </div>
        <div>
          <button className="secondary" onClick={() => setCurrentPage("list")}>
            Show appointments
          </button>
          <button className="cancel" onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="booking-card">
        <form onSubmit={saveAppointment}>
          <label>
            Name
            <input name="patientName" value={form.patientName} onChange={updateForm} required />
          </label>

          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={updateForm} required />
          </label>

          <label>
            Phone
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={updateForm}
              pattern="[0-9]{10}"
              maxLength="10"
              inputMode="numeric"
              required
            />
          </label>

          <label>
            Appointment Date
            <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={updateForm} required />
          </label>

          <label className="full-width">
            Reason
            <textarea name="reason" value={form.reason} onChange={updateForm} required />
          </label>

          <button type="submit">{editingId ? "Update Appointment" : "Save Appointment"}</button>
          {editingId && (
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setForm(emptyForm);
                setEditingId(null);
                setCurrentPage("list");
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {message && <p className="message">{message}</p>}
      </section>
    </main>
  );
}
