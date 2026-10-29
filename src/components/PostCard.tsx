import { Link } from "react-router-dom";
import { Post } from "../types";

interface PostCardProps {
  post: Post;
  isLocal?: boolean;
}

export default function PostCard({ post, isLocal = false }: PostCardProps) {
  return (
    <article className="post-card">
      <div className="post-card-header">
        <span className="post-id">Bài #{post.id}</span>
        {isLocal && <span className="badge-local">Mới tạo (Local)</span>}
      </div>

      <h3 className="post-card-title">
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>

      <p className="post-card-body">
        {post.body.length > 120 ? `${post.body.slice(0, 120)}...` : post.body}
      </p>

      <div className="post-card-footer">
        <Link to={`/posts/${post.id}`} className="read-more">
          Xem chi tiết & bình luận →
        </Link>
      </div>
    </article>
  );
}
