import { useEffect, useState } from "react";
import { Alert, Box, Typography } from "@mui/material";
import { getAllPosts, type DiaryPost } from "../api-helpers/helpers";
import DiaryItem from "./DiaryItem";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

export default function Diaries() {
  const [posts, setPosts] = useState<DiaryPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
          />
        ))}
      </Box>
    </Box>
  );
}
