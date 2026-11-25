import { useEffect, useState } from "react";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import {
  getAllPosts,
  deletePost,
  type DiaryPost,
} from "../api-helpers/helpers";
import DiaryItem from "./DiaryItem";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

export default function Diaries() {
  const [posts, setPosts] = useState<DiaryPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPosts() {
      try {
        const loadedPosts = await getAllPosts(controller.signal);

        if (!controller.signal.aborted) {
          setPosts(loadedPosts);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Could not load travel diaries. Please try again later.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadPosts();

    return () => controller.abort();
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this travel diary?")) return;

    setDeletingId(id);

    try {
      await deletePost(id);
      setPosts((previous) => previous.filter((post) => post._id !== id));
      setNotice({ message: "Diary deleted.", severity: "success" });
    } catch {
      setNotice({ message: "Could not delete the diary.", severity: "error" });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Box sx={{ maxWidth: 720, mx: "auto" }}>
      <Typography
        component="h1"
        variant="h4"
        sx={{ mb: 3, fontFamily: '"Quicksand", sans-serif', fontWeight: 700 }}
      >
        Travel Diaries
      </Typography>

      {isLoading && <Typography>Loading travel diaries…</Typography>}

      {error && <Alert severity="error">{error}</Alert>}

      {!isLoading && !error && posts.length === 0 && (
        <Typography>No travel diaries yet.</Typography>
      )}

      <Box sx={{ display: "grid", gap: 3 }}>
        {posts.map((post) => (
          <DiaryItem
            key={post._id}
            title={post.title}
            description={post.description}
            image={post.image}
            location={post.location}
            date={dateFormatter.format(new Date(post.date))}
            author={
              post.user && typeof post.user === "object"
                ? post.user.name
                : "Unknown author"
            }
            id={post._id}
            isOwner={
              userId !== null &&
              userId ===
                (typeof post.user === "string" ? post.user : post.user?._id)
            }
            isDeleting={deletingId !== null}
            onDelete={handleDelete}
          />
        ))}
      </Box>
      <Snackbar
        open={notice !== null}
        autoHideDuration={3000}
        onClose={() => setNotice(null)}
      >
        {notice ? (
          <Alert severity={notice.severity} onClose={() => setNotice(null)}>
            {notice.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
