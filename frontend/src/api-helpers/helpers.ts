import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export type DiaryPost = {
  _id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  user?: string | { _id: string; name: string } | null;
};

export async function getAllPosts(signal?: AbortSignal): Promise<DiaryPost[]> {
  const response = await api.get<{ posts: DiaryPost[] }>("/posts", { signal });

  return response.data.posts;
}
