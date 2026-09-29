import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import AppointmentForm from "./AppointmentForm";
import AppointmentList from "./AppointmentList";
import LoginPage from "./LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import { getAppointment } from "../api/appointmentApi";

export default function AppointmentRoutes({
  isAuthenticated,
  loggedInUsername,
  appointments,
  loading,
  message,
  form,
  setForm,
  setMessage,
  onLogin,
  onLogout,
  onSubmit,
  onChange,
  onChangeStatus,
  onDelete,
}) {
  const navigate = useNavigate();

  const resetForm = useCallback(() => {
    setForm({
      patientName: "",
      email: "",
      phone: "",
      appointmentDate: "",
      reason: "",
    });
    setMessage("");
  }, [setForm, setMessage]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/appointments" replace />
          ) : (
            <LoginPage onLogin={onLogin} />
          )
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppointmentList
              loggedInUsername={loggedInUsername}
              appointments={appointments}
              loading={loading}
              message={message}
              onLogout={onLogout}
              onAdd={() => {
                resetForm();
                navigate("/appointments/new");
              }}
              onChangeStatus={onChangeStatus}
              onEdit={(id) => {
                setMessage("");
                navigate(`/appointments/${id}/edit`);
              }}
              onDelete={onDelete}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments/new"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppointmentFormRoute
              form={form}
              message={message}
              resetForm={resetForm}
              onFormChange={onChange}
              onSubmit={onSubmit}
              onLogout={onLogout}
              onList={() => navigate("/appointments")}
              onCancel={() => {
                resetForm();
                navigate("/appointments");
              }}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments/:id/edit"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppointmentEditRoute
              form={form}
              message={message}
              setForm={setForm}
              setMessage={setMessage}
              onFormChange={onChange}
              onSubmit={onSubmit}
              onLogout={onLogout}
              onList={() => navigate("/appointments")}
              onCancel={() => {
                resetForm();
                navigate("/appointments");
              }}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/appointments" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}

function AppointmentFormRoute({
  form,
  message,
  resetForm,
  onFormChange,
  onSubmit,
  onLogout,
  onList,
  onCancel,
}) {
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return (
    <AppointmentForm
      form={form}
      editingId={null}
      message={message}
      onList={onList}
      onLogout={onLogout}
      onSubmit={(event) => onSubmit(event, null)}
      onChange={onFormChange}
      onCancel={onCancel}
    />
  );
}

function AppointmentEditRoute({
  form,
  message,
  setForm,
  setMessage,
  onFormChange,
  onSubmit,
  onLogout,
  onList,
  onCancel,
}) {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    async function loadAppointment() {
      try {
        const response = await getAppointment(id);
        if (!active) return;

        setForm({
          patientName: response.data.patientName,
          email: response.data.email,
          phone: response.data.phone,
          appointmentDate: response.data.appointmentDate,
          reason: response.data.reason,
        });
        setMessage("");
      } catch (error) {
        if (error.response?.status === 401) {
          onLogout("expired");
          return;
        }
        if (active) setMessage(error.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAppointment();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div className="empty-state">Loading appointment...</div>;
  }

  return (
    <AppointmentForm
      form={form}
      editingId={id}
      message={message}
      onList={onList}
      onLogout={onLogout}
      onSubmit={(event) => onSubmit(event, id)}
      onChange={onFormChange}
      onCancel={onCancel}
    />
  );
}
