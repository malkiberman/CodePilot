import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import CustomToolbar from "./components/Toolbar";
import { Box, Container } from "@mui/material";
import { FC } from "react";

const App: FC = () => {
  return (
    <Router>
      <CustomToolbar />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Container maxWidth="md">
          <AppRoutes />
        </Container>
      </Box>
    </Router>
  );
};

export default App;
