import { useState } from "react";

const emptyLogin = {
  username: "",
  password: "",
};

export default function LoginPage({
  onLogin,
}) {
  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function updateLoginForm(event) {
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
  }

  async function submitLogin(event) {
    event.preventDefault();
    setMessage("");

    const errorMessage = await onLogin(loginForm);
    if (errorMessage) {
      setMessage(errorMessage);
      return;
    }

    setLoginForm(emptyLogin);
    setShowPassword(false);
  }

  return (
    <main className="auth-layout">
      <section className="booking-card auth-card">
        <div className="card-heading">
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Sign in to continue</h2>
          <p>Access your appointment dashboard securely.</p>
        </div>
        <form onSubmit={submitLogin}>
          <label>
            Username
            <input
              name="username"
              value={loginForm.username}
              onChange={updateLoginForm}
              autoComplete="username"
              placeholder="Enter your username"
              required
            />
          </label>

          <label className="password-label">
            Password
            <span className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginForm.password}
                onChange={updateLoginForm}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2.5 12s3.4-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.4 5.5-9.5 5.5S2.5 12 2.5 12Z" />
                  <circle cx="12" cy="12" r="2.5" />
                  {showPassword && (
                    <path className="eye-slash" d="m4 4 16 16" />
                  )}
                </svg>
              </button>
            </span>
          </label>

          <button className="primary-action" type="submit">
            Sign in
          </button>
        </form>

        {message && <p className="message error-message">{message}</p>}
      </section>
    </main>
  );
}
