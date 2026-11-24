import ModeOfTravelIcon from "@mui/icons-material/ModeOfTravel";
import { AppBar, Tab, Tabs, Toolbar } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const links = [
  { label: "Home", path: "/" },
  { label: "Diaries", path: "/diaries" },
  { label: "Auth", path: "/auth" },
];

export default function Header() {
  const { pathname } = useLocation();
  const activeTab = links.find((link) => link.path === pathname);

  return (
    <AppBar position="sticky" color="inherit">
      <Toolbar sx={{ gap: 1 }}>
        <ModeOfTravelIcon />

        <Tabs
          aria-label="Main navigation"
          value={activeTab?.path ?? false}
          sx={{ ml: "auto", minWidth: 0 }}
        >
          {links.map(({ label, path }) => (
            <Tab
              key={path}
              component={Link}
              to={path}
              value={path}
              label={label}
              sx={{
                minWidth: { xs: 60, sm: 90 },
                px: { xs: 1, sm: 2 },
              }}
            />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
