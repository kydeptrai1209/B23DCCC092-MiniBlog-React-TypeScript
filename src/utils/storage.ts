import { Post, User } from "../types";

const POSTS_KEY = "miniblog_posts";
const USER_KEY = "miniblog_user";

// Đọc danh sách bài viết đã lưu từ localStorage
export function getLocalPosts(): Post[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) return [];
    const parsed: Post[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "number" &&
        typeof item.userId === "number" &&
        typeof item.title === "string" &&
        typeof item.body === "string"
    );
  } catch {
    return [];
  }
}

// Tạo ID mới duy nhất cho bài viết lưu vào localStorage (bắt đầu từ 101)
export function generateNextPostId(): number {
  const currentPosts = getLocalPosts();
  const maxId = currentPosts.reduce(
    (max, post) => (post.id > max ? post.id : max),
    100
  );
  return maxId + 1;
}

// Lưu bài viết mới vào đầu danh sách trong localStorage
export function saveLocalPost(newPost: Post): void {
  const currentPosts = getLocalPosts();
  const updatedPosts = [newPost, ...currentPosts];
  localStorage.setItem(POSTS_KEY, JSON.stringify(updatedPosts));
}

// Đọc thông tin đăng nhập từ localStorage
export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.username === "string" &&
      parsed.username.trim() !== ""
    ) {
      return { username: parsed.username.trim() };
    }
    return null;
  } catch {
    return null;
  }
}

// Lưu hoặc xóa thông tin đăng nhập trong localStorage
export function saveStoredUser(user: User | null): void {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}
