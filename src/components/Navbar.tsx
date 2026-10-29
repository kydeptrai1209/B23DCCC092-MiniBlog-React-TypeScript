import { Link, NavLink, useNavigate } from "react-router-dom";
import { User } from "../types";

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link active" : "nav-link";

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          MiniBlog
        </Link>

        <nav className="nav-menu">
          <NavLink to="/" end className={linkClass}>
            Trang chủ
          </NavLink>
          <NavLink to="/create" className={linkClass}>
            Viết bài
          </NavLink>
        </nav>

        <div className="auth-box">
          {user ? (
            <>
              <span className="welcome-text">
                Xin chào, <strong>{user.username}</strong>
              </span>
              <button
                type="button"
                className="btn btn-logout"
                onClick={handleLogoutClick}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-primary">
              Đăng nhập
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
