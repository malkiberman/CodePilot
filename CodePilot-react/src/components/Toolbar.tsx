import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";

interface ToolbarProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

const CustomToolbar: FC<ToolbarProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          CodePilot
        </Typography>

        {isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} to="/files">
              Files
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default CustomToolbar;
