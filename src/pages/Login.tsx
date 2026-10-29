import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { User } from "../types";

interface LoginProps {
  user: User | null;
  onLogin: (user: User) => void;
}

export default function Login({ user, onLogin }: LoginProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const state = location.state as { from?: { pathname?: string } } | null;
  const redirectTo = state?.from?.pathname || "/create";

  // Nếu đã đăng nhập rồi thì chuyển về trang đích
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const username = form.username.trim();
    const password = form.password;

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      return;
    }

    if (username === "admin" && password === "123456") {
      onLogin({ username: "admin" });
      navigate(redirectTo, { replace: true });
    } else {
      setError("Sai tài khoản hoặc mật khẩu! (Tài khoản đúng: admin / 123456)");
    }
  };

  return (
    <section className="form-page">
      <div className="form-card">
        <h1>Đăng nhập</h1>
        <p className="form-hint">
          Đăng nhập để truy cập trang viết bài mới (Tài khoản mẫu:{" "}
          <code>admin</code> / <code>123456</code>)
        </p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Tài khoản</label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-input"
              placeholder="Nhập tài khoản (admin)..."
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Nhập mật khẩu (123456)..."
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Đăng nhập
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Quay lại
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
