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

type LoginData = {
  email: string;
  password: string;
};

type SignupData = LoginData & {
  name: string;
};

export async function signupUser(data: SignupData) {
  const response = await api.post<{ user: { _id: string } }>(
    "/user/signup",
    data,
  );

  return response.data.user._id;
}

export async function loginUser(data: LoginData) {
  const response = await api.post<{ id: string; message: string }>(
    "/user/login",
    data,
  );

  return response.data.id;
}