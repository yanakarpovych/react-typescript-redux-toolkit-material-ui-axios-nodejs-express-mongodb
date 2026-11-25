import { useEffect, useState } from "react";
import { Alert, Typography } from "@mui/material";
import { isAxiosError } from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPostById, type DiaryPost } from "../api-helpers/helpers";
import type { RootState } from "../store";
import Add from "./Add";

export default function DiaryUpdate() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Alert severity="error">Missing post ID.</Alert>;
  }

  return <EditPost key={id} id={id} />;
}

function EditPost({ id }: { id: string }) {
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [post, setPost] = useState<DiaryPost | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadPost() {
      try {
        const result = await getPostById(id, controller.signal);

        if (!controller.signal.aborted) {
          setPost(result);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        const message = isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message
          : undefined;

        setError(message ?? "Could not load the post.");
      }
    }

    void loadPost();
    return () => controller.abort();
  }, [id]);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!post) return <Typography>Loading diary…</Typography>;

  const authorId = typeof post.user === "string" ? post.user : post.user?._id;

  if (authorId !== userId) {
    return <Alert severity="info">You can only edit your own diaries.</Alert>;
  }

  return (
    <Add
      edit={{
        id: post._id,
        values: {
          title: post.title,
          description: post.description,
          image: post.image,
          location: post.location,
          date: post.date.slice(0, 10),
        },
      }}
    />
  );
}
