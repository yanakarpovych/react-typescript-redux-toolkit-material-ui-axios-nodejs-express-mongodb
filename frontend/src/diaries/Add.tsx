import { useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { isAxiosError } from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost, type DiaryFormData } from "../api-helpers/helpers";
import type { RootState } from "../store";

const initialInputs: DiaryFormData = {
  title: "",
  description: "",
  image: "",
  location: "",
  date: "",
};

export default function Add() {
  const userId = useSelector((state: RootState) => state.auth.userId);
  const navigate = useNavigate();

  const [inputs, setInputs] = useState(initialInputs);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setInputs((previous) => ({
      ...previous,
      [name]: value,
    }));
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userId) {
      navigate("/auth", { replace: true });
      return;
    }

    const data: DiaryFormData = {
      title: inputs.title.trim(),
      description: inputs.description.trim(),
      image: inputs.image.trim(),
      location: inputs.location.trim(),
      date: inputs.date,
    };

    if (Object.values(data).some((value) => value === "")) {
      setError("Please fill in every field.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await createPost(data, userId);
      navigate("/diaries");
    } catch (error) {
      if (isAxiosError<{ message?: string }>(error)) {
        setError(error.response?.data?.message ?? "Could not create the post.");
      } else {
        setError("Could not create the post.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        mx: "auto",
        my: { xs: 2, sm: 4 },
        p: { xs: 2, sm: 4 },
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography component="h1" variant="h4" sx={{ textAlign: "center" }}>
        Add a travel diary
      </Typography>

      <TextField
        label="Title"
        name="title"
        value={inputs.title}
        onChange={handleChange}
        required
      />

      <TextField
        label="Description"
        name="description"
        value={inputs.description}
        onChange={handleChange}
        multiline
        minRows={3}
        required
      />

      <TextField
        label="Image URL or path"
        name="image"
        value={inputs.image}
        onChange={handleChange}
        placeholder="/road.jpg"
        required
      />

      <TextField
        label="Location"
        name="location"
        value={inputs.location}
        onChange={handleChange}
        required
      />

      <TextField
        label="Travel date"
        name="date"
        type="date"
        value={inputs.date}
        onChange={handleChange}
        slotProps={{ inputLabel: { shrink: true } }}
        required
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {isSubmitting ? "Publishing…" : "Publish diary"}
      </Button>
    </Box>
  );
}