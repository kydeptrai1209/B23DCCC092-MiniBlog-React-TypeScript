import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="not-found-page">
      <h1 className="not-found-code">404</h1>
      <h2>Không tìm thấy trang</h2>
      <p>Đường dẫn bạn truy cập không tồn tại hoặc đã bị thay đổi.</p>
      <Link to="/" className="btn btn-primary">
        Quay về trang chủ
      </Link>
    </section>
  );
}
