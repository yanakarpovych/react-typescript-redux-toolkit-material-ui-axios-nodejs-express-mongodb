import { useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { isAxiosError } from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../api-helpers/helpers";
import { login } from "../store";

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setInputs((previous) => ({ ...previous, [name]: value }));
    setError("");
  }

  function switchMode() {
    setIsSignup((previous) => !previous);
    setInputs((previous) => ({ ...previous, password: "" }));
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const name = inputs.name.trim();
    const email = inputs.email.trim();
    const password = inputs.password;

    if (isSignup && !name) {
      setError("Please enter your name.");
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = isSignup
        ? await signupUser({ name, email, password })
        : await loginUser({ email, password });

      localStorage.setItem("userId", userId);
      dispatch(login(userId));
      navigate("/diaries", { replace: true });
    } catch (error) {
      if (isAxiosError<{ message?: string }>(error)) {
        setError(
          error.response?.data?.message ??
            "Could not complete the request. Please try again.",
        );
      } else {
        setError("Something went wrong. Please try again.");
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
        maxWidth: 420,
        mx: "auto",
        my: { xs: 3, sm: 6 },
        p: { xs: 2, sm: 4 },
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography component="h1" variant="h4" sx={{ textAlign: "center" }}>
        {isSignup ? "Sign up" : "Log in"}
      </Typography>

      {isSignup && (
        <TextField
          label="Name"
          name="name"
          value={inputs.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />
      )}

      <TextField
        label="Email"
        name="email"
        type="email"
        value={inputs.email}
        onChange={handleChange}
        autoComplete="email"
        required
      />

      <TextField
        label="Password"
        name="password"
        type="password"
        value={inputs.password}
        onChange={handleChange}
        autoComplete={isSignup ? "new-password" : "current-password"}
        slotProps={{ htmlInput: { minLength: 6 } }}
        required
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {isSubmitting ? "Please wait…" : isSignup ? "Sign up" : "Log in"}
      </Button>

      <Button type="button" onClick={switchMode} disabled={isSubmitting}>
        {isSignup ? "Already have an account? Log in" : "Create an account"}
      </Button>
    </Box>
  );
}