import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import CreatePost from "./pages/CreatePost";
import NotFound from "./pages/NotFound";
import { User } from "./types";
import { getStoredUser, saveStoredUser } from "./utils/storage";
import "./App.css";

export default function App() {
  // Khởi tạo state đăng nhập từ localStorage (chỉ chạy ở lần render đầu tiên)
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    saveStoredUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    saveStoredUser(null);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<MainLayout user={user} onLogout={handleLogout} />}
      >
        <Route index element={<Home />} />
        <Route path="posts/:id" element={<PostDetail />} />
        <Route
          path="login"
          element={<Login user={user} onLogin={handleLogin} />}
        />

        {/* Bảo vệ trang viết bài: chỉ người đã đăng nhập mới truy cập được */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="create" element={<CreatePost />} />
        </Route>

        {/* Trang 404 cho các đường dẫn không tồn tại */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
