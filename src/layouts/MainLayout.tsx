import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { User } from "../types";

interface MainLayoutProps {
  user: User | null;
  onLogout: () => void;
}

export default function MainLayout({ user, onLogout }: MainLayoutProps) {
  return (
    <div className="app-wrapper">
      <Navbar user={user} onLogout={onLogout} />
      <main className="container main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
