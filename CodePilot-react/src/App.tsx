import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import CustomToolbar from "./components/Toolbar";
import { Box, Container } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { getCustomTheme } from "./theme/customTheme";
import { CssBaseline } from "@mui/material";

const App: FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const theme = getCustomTheme(mode);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsAuthenticated(!!token);
    console.log("Auth state updated:", !!token);
  }, []);

  return (
  
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <CustomToolbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        mode={mode}
        setMode={setMode}
      />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Container maxWidth="md">
          <AppRoutes
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
          />
        </Container>
      </Box>
    </Router>
  </ThemeProvider>

  );
};

export default App;
