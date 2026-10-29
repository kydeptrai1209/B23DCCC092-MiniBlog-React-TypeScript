import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Post, Comment } from "../types";
import { getLocalPosts } from "../utils/storage";

const API = "https://jsonplaceholder.typicode.com";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState<number>(0);

  useEffect(() => {
    let ignore = false;

    async function loadPostDetail() {
      setLoading(true);
      setError(null);
      setPost(null);
      setComments([]);

      try {
        const numericId = Number(id);
        if (!id || !Number.isInteger(numericId) || numericId <= 0) {
          throw new Error("Mã bài viết không hợp lệ.");
        }

        // Kiểm tra nếu bài viết vừa được tạo mới trong localStorage
        const localPost = getLocalPosts().find((p) => p.id === numericId);
        if (localPost) {
          if (!ignore) {
            setPost(localPost);
            setComments([]);
            setLoading(false);
          }
          return;
        }

        // Gọi API lấy chi tiết bài viết và danh sách bình luận lần lượt
        const postRes = await fetch(`${API}/posts/${numericId}`);
        if (!postRes.ok) {
          throw new Error(
            `Không tìm thấy bài viết hoặc lỗi tải dữ liệu (Mã lỗi: ${postRes.status})`
          );
        }
        const postData: Post = await postRes.json();

        const commentsRes = await fetch(`${API}/posts/${numericId}/comments`);
        if (!commentsRes.ok) {
          throw new Error(
            `Không thể tải danh sách bình luận (Mã lỗi: ${commentsRes.status})`
          );
        }
        const commentsData: Comment[] = await commentsRes.json();

        if (!ignore) {
          setPost(postData);
          setComments(commentsData);
        }
      } catch (err) {
        if (!ignore) {
          const message =
            err instanceof Error
              ? err.message
              : "Đã xảy ra lỗi khi tải bài viết.";
          setError(message);
        }
      }

      if (!ignore) {
        setLoading(false);
      }
    }

    loadPostDetail();

    return () => {
      ignore = true;
    };
  }, [id, reloadCount]);

  if (loading) {
    return (
      <div className="status-box loading">
        <p>Đang tải chi tiết bài viết và bình luận...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="status-box error">
        <p>Thông báo lỗi: {error ?? "Không tìm thấy bài viết."}</p>
        <div className="error-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setReloadCount(reloadCount + 1)}
          >
            Thử lại
          </button>
          <Link to="/" className="btn btn-secondary">
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <Link to="/" className="back-link">
        ← Quay lại danh sách bài viết
      </Link>

      <article className="post-detail-card">
        <div className="post-detail-meta">
          <span>Bài viết #{post.id}</span>
          <span>Tác giả ID: {post.userId}</span>
        </div>
        <h1 className="post-detail-title">{post.title}</h1>
        <p className="post-detail-body">{post.body}</p>
      </article>

      <section className="comments-section">
        <h2 className="comments-heading">
          Danh sách bình luận ({comments.length})
        </h2>

        {comments.length === 0 ? (
          <p className="empty-comments">
            Chưa có bình luận nào cho bài viết này.
          </p>
        ) : (
          <ul className="comment-list">
            {comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                <div className="comment-header">
                  <strong className="comment-name">{comment.name}</strong>
                  <span className="comment-email">{comment.email}</span>
                </div>
                <p className="comment-body">{comment.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
