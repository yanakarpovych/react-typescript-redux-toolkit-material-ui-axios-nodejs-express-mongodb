import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Box>
      <Box sx={{ position: "relative" }}>
        <Box
          component="img"
          src="/image.jpg"
          alt="Open road stretching into the distance"
          
          sx={{
            display: "block",
            width: "100%",
            height: "auto",
          }}
        />

        <Typography
          component="h1"
          sx={{
            position: "absolute",
            top: 0,
            width: "100%",
            px: 2,
            py: 1,
            textAlign: "center",
            color: "primary.contrastText",
            bgcolor: "primary.main",
            fontFamily: '"Dancing Script", cursive',
            fontWeight: 700,
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          Dare to live the life you’ve always wanted
        </Typography>
      </Box>

      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography
          component="h2"
          sx={{
            mb: 3,
            fontFamily: '"Quicksand", sans-serif',
            fontWeight: 600,
            fontSize: { xs: "1.4rem", md: "2rem" },
          }}
        >
          Share your travel diaries with us
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Button component={Link} to="/auth" variant="outlined">
            Share Your Story
          </Button>

          <Button component={Link} to="/diaries" variant="contained">
            View Diaries
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
