import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Link,
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
  id: string;
  isOwner: boolean;
  isDeleting: boolean;
  onDelete: (id: string) => void;
};

export default function DiaryItem({
  title,
  description,
  image,
  location,
  date,
  author,
  id,
  isOwner,
  isDeleting,
  onDelete,
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
      {isOwner && (
        <CardActions>
          <Button
            component={Link}
            to={`/post/${id}`}
            size="small"
            disabled={isDeleting}
          >
            Edit
          </Button>

          <Button
            type="button"
            size="small"
            color="error"
            disabled={isDeleting}
            onClick={() => onDelete(id)}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
