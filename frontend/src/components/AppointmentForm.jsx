function BrandHeader({ editingId, onList, onLogout }) {
  return (
    <header className="page-header">
      <div>
        <div className="brand-lockup">
          <span className="brand-mark small">+</span>
          <span>DUROZEN CARE</span>
        </div>
        <p className="eyebrow">EASY SCHEDULING</p>
        <h1>{editingId ? "Edit Appointment" : "Add Appointment"}</h1>
        <p className="subheading">
          Capture the details needed for a smooth patient visit.
        </p>
      </div>
      <div>
        <button className="secondary outline-button" onClick={onList}>
          View appointments
        </button>
        <button className="cancel outline-button" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}

export default function AppointmentForm({
  form,
  editingId,
  message,
  onList,
  onLogout,
  onSubmit,
  onChange,
  onCancel,
}) {
  return (
    <main className="app-shell">
      <BrandHeader
        editingId={editingId}
        onList={onList}
        onLogout={onLogout}
      />

      <section className="booking-card">
        <div className="form-intro">
          <div className="form-icon">+</div>
          <div>
            <h2>Appointment details</h2>
            <p>
              Fill in the information below to{" "}
              {editingId ? "update this appointment" : "create a new appointment"}.
            </p>
          </div>
        </div>
        <form onSubmit={onSubmit}>
          <label>
            Name
            <input
              name="patientName"
              value={form.patientName}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Phone
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={onChange}
              pattern="[0-9]{10}"
              maxLength="10"
              inputMode="numeric"
              required
            />
          </label>

          <label>
            Appointment Date
            <input
              type="date"
              name="appointmentDate"
              value={form.appointmentDate}
              onChange={onChange}
              required
            />
          </label>

          <label className="full-width">
            Reason
            <textarea
              name="reason"
              value={form.reason}
              onChange={onChange}
              required
            />
          </label>

          <button className="primary-action" type="submit">
            {editingId ? "Update appointment" : "Save appointment"}
          </button>
          {editingId && (
            <button type="button" className="secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </form>

        {message && <p className="message">{message}</p>}
      </section>
    </main>
  );
}
