import { useEffect, useState } from "react";
import { Alert, Box, Button, Typography } from "@mui/material";
import { isAxiosError } from "axios";
import { Link as RouterLink } from "react-router-dom";
import {
  deletePost,
  getUserProfile,
  type UserProfile,
} from "../api-helpers/helpers";
import DiaryItem from "../diaries/DiaryItem";

type ProfileProps = {
  userId: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

export default function Profile({ userId }: ProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadError, setLoadError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      try {
        const user = await getUserProfile(userId, controller.signal);

        if (!controller.signal.aborted) {
          setProfile(user);
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        const message = isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message
          : undefined;

        setLoadError(message ?? "Could not load your profile.");
      }
    }

    void loadProfile();
    return () => controller.abort();
  }, [userId]);

  async function handleDelete(id: string) {
    if (deletingId !== null) return;
    if (!window.confirm("Delete this travel diary?")) return;

    setDeletingId(id);
    setNotice(null);

    try {
      await deletePost(id);

      setProfile((current) => {
        if (!current) return current;

        return {
          ...current,
          posts: current.posts.filter((post) => post._id !== id),
        };
      });

      setNotice({ severity: "success", message: "Diary deleted." });
    } catch {
      setNotice({ severity: "error", message: "Could not delete the diary." });
    } finally {
      setDeletingId(null);
    }
  }

  if (loadError) return <Alert severity="error">{loadError}</Alert>;
  if (!profile) return <Typography>Loading profile…</Typography>;

  return (
    <Box sx={{ maxWidth: 720, mx: "auto" }}>
      <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
        My profile
      </Typography>

      <Typography>Name: {profile.name}</Typography>
      <Typography>Email: {profile.email}</Typography>

      <Typography component="h2" variant="h5" sx={{ mt: 4, mb: 2 }}>
        My diaries ({profile.posts.length})
      </Typography>

      {notice && (
        <Alert
          severity={notice.severity}
          onClose={() => setNotice(null)}
          sx={{ mb: 2 }}
        >
          {notice.message}
        </Alert>
      )}

      {profile.posts.length === 0 ? (
        <Box>
          <Typography sx={{ mb: 2 }}>
            You haven’t published any diaries yet.
          </Typography>

          <Button component={RouterLink} to="/add" variant="contained">
            Add your first diary
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "grid", gap: 3 }}>
          {profile.posts.map((post) => {
            const authorId =
              typeof post.user === "string" ? post.user : post.user?._id;

            return (
              <DiaryItem
                key={post._id}
                id={post._id}
                title={post.title}
                description={post.description}
                image={post.image}
                location={post.location}
                date={dateFormatter.format(new Date(post.date))}
                author={profile.name}
                isOwner={authorId === userId}
                isDeleting={deletingId === post._id}
                onDelete={handleDelete}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
}
