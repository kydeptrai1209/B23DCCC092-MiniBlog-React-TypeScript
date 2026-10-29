import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Post } from "../types";
import { saveLocalPost, generateNextPostId } from "../utils/storage";

interface FormErrors {
  title?: string;
  body?: string;
}

export default function CreatePost() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", body: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Kiểm tra dữ liệu hợp lệ trước khi lưu
  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    const trimmedTitle = form.title.trim();
    const trimmedBody = form.body.trim();

    if (!trimmedTitle) {
      newErrors.title = "Tiêu đề bài viết không được để trống.";
    } else if (trimmedTitle.length < 3) {
      newErrors.title = "Tiêu đề bài viết phải có ít nhất 3 ký tự.";
    }

    if (!trimmedBody) {
      newErrors.body = "Nội dung bài viết không được để trống.";
    } else if (trimmedBody.length < 5) {
      newErrors.body = "Nội dung bài viết phải có ít nhất 5 ký tự.";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (validationErrors.title || validationErrors.body) {
      setErrors(validationErrors);
      return;
    }

    const newPost: Post = {
      id: generateNextPostId(),
      userId: 1,
      title: form.title.trim(),
      body: form.body.trim(),
    };

    saveLocalPost(newPost);
    navigate("/");
  };

  const handleReset = () => {
    setForm({ title: "", body: "" });
    setErrors({});
  };

  return (
    <section className="form-page">
      <div className="form-card">
        <h1>Viết bài mới</h1>
        <p className="form-hint">
          Bài viết mới sẽ được lưu vào <code>localStorage</code> và hiển thị
          cùng danh sách bài viết ở trang chủ.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Tiêu đề bài viết *</label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input"
              placeholder="Nhập tiêu đề bài viết..."
              value={form.title}
              onChange={handleChange}
            />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="body">Nội dung bài viết *</label>
            <textarea
              id="body"
              name="body"
              rows={6}
              className="form-textarea"
              placeholder="Nhập nội dung chi tiết của bài viết..."
              value={form.body}
              onChange={handleChange}
            />
            {errors.body && <p className="field-error">{errors.body}</p>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Đăng bài viết
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
            >
              Nhập lại
            </button>
            <Link to="/" className="btn btn-secondary">
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
