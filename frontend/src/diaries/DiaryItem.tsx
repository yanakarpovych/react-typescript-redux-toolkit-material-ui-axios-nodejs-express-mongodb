import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

type DiaryItemProps = {
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  author: string;
};

export default function DiaryItem({
  title,
  description,
  image,
  location,
  date,
  author,
}: DiaryItemProps) {
  return (
    <Card component="article" sx={{ width: "100%", boxShadow: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#486581" }}>
            {author.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LocationOnOutlinedIcon fontSize="small" />
            {location}
          </Box>
        }
        subheader={date}
      />

      <CardMedia
        component="img"
        image={image}
        alt={title}
        sx={{ height: { xs: 190, sm: 260 }, objectFit: "cover" }}
      />

      <CardContent>
        <Typography component="h2" variant="h5" sx={{ mb: 1 }}>
          {title}
        </Typography>

        <Divider sx={{ mb: 1.5 }} />

        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {author}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
