import { Box, Typography } from "@mui/material";
import DiaryItem from "./DiaryItem";

const diaries = [
  {
    id: "road-trip",
    title: "The scenic route",
    description:
      "We left early and took the longer road, stopping whenever the view opened up.",
    image: "/road.jpg",
    location: "Carpathians, Ukraine",
    date: "November 20, 2026",
    author: "Yana",
  },
  {
    id: "mountain-walk",
    title: "A morning in the mountains",
    description:
      "By the time we reached the ridge, the clouds had lifted and we could see the whole valley.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
    location: "The Alps",
    date: "November 22, 2026",
    author: "Alex",
  },
];

export default function Diaries() {
  return (
    <Box sx={{ maxWidth: 720, mx: "auto" }}>
      <Typography
        component="h1"
        variant="h4"
        sx={{ mb: 3, fontFamily: '"Quicksand", sans-serif', fontWeight: 700 }}
      >
        Travel Diaries
      </Typography>

      <Box sx={{ display: "grid", gap: 3 }}>
        {diaries.map(({ id, ...diary }) => (
          <DiaryItem key={id} {...diary} />
        ))}
      </Box>
    </Box>
  );
}
