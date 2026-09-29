function BrandHeader({ loggedInUsername, onLogout }) {
  return (
    <header>
      <div className="page-header">
        <div>
          <div className="brand-lockup">
            <span className="brand-mark small">+</span>
            <span>DUROZEN CARE</span>
          </div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1>Appointment List</h1>
          <p className="subheading">
            Signed in as <strong>{loggedInUsername}</strong>
          </p>
        </div>
        <button className="secondary outline-button" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}

export default function AppointmentList({
  loggedInUsername,
  appointments,
  loading,
  message,
  onLogout,
  onAdd,
  onChangeStatus,
  onEdit,
  onDelete,
}) {
  return (
    <main className="app-shell">
      <BrandHeader loggedInUsername={loggedInUsername} onLogout={onLogout} />

      <section className="appointments">
        <div className="section-title">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h2>Saved appointments</h2>
          </div>
          <button className="primary-action" onClick={onAdd}>
            + Add appointment
          </button>
        </div>
        {message && <p className="message">{message}</p>}

        {loading ? (
          <div className="empty-state">
            <span className="loading-dot" />
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <strong>No appointments yet</strong>
            <span>
              Add your first appointment to start building your schedule.
            </span>
          </div>
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
                        onClick={() =>
                          onChangeStatus(
                            item.id,
                            item.status === "PENDING" ? "CONFIRMED" : "PENDING",
                          )
                        }
                      >
                        {item.status}
                      </button>
                    </td>
                    <td className="actions">
                      <button
                        className="secondary"
                        onClick={() => onEdit(item.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="cancel"
                        onClick={() => onDelete(item.id)}
                      >
                        Delete
                      </button>
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
