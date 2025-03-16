import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { FC, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const CustomToolbar: FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // בדוק אם יש טוקן ב-localStorage או sessionStorage
    const token = sessionStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    // נקה את הטוקן מה-localStorage או sessionStorage
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
            <Button color="inherit" component={Link} to="/upload">
              Upload
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
