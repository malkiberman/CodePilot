import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import CustomToolbar from "./components/Toolbar";
import { Box, Container } from "@mui/material";
import { FC, useEffect, useState } from "react";
import dotenv from 'dotenv';

const App: FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsAuthenticated(!!token);
    console.log("Auth state updated:", !!token);
  }, []);

  return (
    <Router>
      <CustomToolbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Container maxWidth="md">
          <AppRoutes isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        </Container>
      </Box>
    </Router>
  );
};

export default App;
