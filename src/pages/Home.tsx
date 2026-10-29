import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Post } from "../types";
import { getLocalPosts } from "../utils/storage";
import PostCard from "../components/PostCard";

const API = "https://jsonplaceholder.typicode.com";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [reloadCount, setReloadCount] = useState<number>(0);

  useEffect(() => {
    let ignore = false;

    async function loadPosts() {
      setLoading(true);
      setError(null);

      // Đọc bài viết trong localStorage trước để nếu API lỗi vẫn hiển thị được bài tự tạo
      const savedLocalPosts = getLocalPosts();
      setLocalPosts(savedLocalPosts);
      setPosts(savedLocalPosts);

      try {
        const res = await fetch(`${API}/posts`);
        if (!res.ok) {
          throw new Error(`Lỗi tải danh sách bài viết (Mã lỗi: ${res.status})`);
        }
        const apiPosts: Post[] = await res.json();
        if (!ignore) {
          setPosts([...savedLocalPosts, ...apiPosts]);
        }
      } catch (err) {
        if (!ignore) {
          const message =
            err instanceof Error
              ? err.message
              : "Đã xảy ra lỗi khi tải dữ liệu.";
          setError(message);
        }
      }

      if (!ignore) {
        setLoading(false);
      }
    }

    loadPosts();

    return () => {
      ignore = true;
    };
  }, [reloadCount]);

  // Lọc danh sách bài viết theo tiêu đề (kết hợp useMemo như bài giảng React Hooks)
  const filteredPosts = useMemo(
    () =>
      posts.filter((post) =>
        post.title.toLowerCase().includes(keyword.trim().toLowerCase())
      ),
    [posts, keyword]
  );

  if (loading) {
    return (
      <div className="status-box loading">
        <p>Đang tải danh sách bài viết...</p>
      </div>
    );
  }

  return (
    <section className="home-page">
      <div className="page-header">
        <div>
          <h1>Danh sách bài viết</h1>
          <p className="subtitle">
            Tổng cộng {filteredPosts.length} bài viết
            {keyword.trim() ? ` khớp với "${keyword.trim()}"` : ""}
          </p>
        </div>
        <Link to="/create" className="btn btn-primary">
          + Viết bài mới
        </Link>
      </div>

      <div className="search-bar">
        <label htmlFor="search-input" className="search-label">
          Tìm kiếm theo tiêu đề:
        </label>
        <div className="search-input-group">
          <input
            id="search-input"
            type="text"
            className="form-input"
            placeholder="Nhập từ khóa tiêu đề bài viết..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setKeyword("")}
            >
              Xóa
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="status-box error">
          <p>Thông báo lỗi: {error}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setReloadCount(reloadCount + 1)}
          >
            Thử lại
          </button>
        </div>
      )}

      {filteredPosts.length > 0 ? (
        <div className="post-grid">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isLocal={localPosts.some((p) => p.id === post.id)}
            />
          ))}
        </div>
      ) : (
        (!error || posts.length > 0) && (
          <div className="empty-box">
            <p>Không tìm thấy bài viết nào phù hợp với từ khóa "{keyword}".</p>
          </div>
        )
      )}
    </section>
  );
}
