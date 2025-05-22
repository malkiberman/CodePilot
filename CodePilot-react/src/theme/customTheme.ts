// src/theme/customTheme.ts
import { createTheme } from "@mui/material/styles";

export const getCustomTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#00E676",
      },
      secondary: {
        main: "#BA68C8",
      },
      background: {
        default: mode === "dark" ? "#0D0D0D" : "#F9F9F9",
        paper: mode === "dark" ? "#1A1A1A" : "#FFFFFF",
      },
      text: {
        primary: mode === "dark" ? "#E0E0E0" : "#1A1A1A",
        secondary: mode === "dark" ? "#A0A0A0" : "#555555",
      },
    },
    typography: {
      fontFamily: `"Chakra Petch", "Segoe UI", "Helvetica Neue", sans-serif`,
      h1: {
        fontWeight: 800,
        fontSize: "3.5rem",
        letterSpacing: "-0.5px",
      },
      h2: {
        fontWeight: 700,
        fontSize: "2.5rem",
      },
      h3: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
        fontSize: "1.3rem",
      },
      body1: {
        fontWeight: 400,
      },
      button: {
        fontWeight: 600,
        fontFamily: `"Chakra Petch", "Segoe UI", "Helvetica Neue", sans-serif`,
        textTransform: "none",
      },
    },
    shape: {
      borderRadius: 20,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: `"Chakra Petch", "Segoe UI", "Helvetica Neue", sans-serif`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: `"Chakra Petch", "Segoe UI", "Helvetica Neue", sans-serif`,
            borderRadius: 12,
            padding: "10px 24px",
            transition: "all 0.3s ease-in-out",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              mode === "dark"
                ? "0 4px 20px rgba(0, 255, 200, 0.1)"
                : "0 4px 20px rgba(0, 0, 0, 0.05)",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: `"Chakra Petch", "Segoe UI", "Helvetica Neue", sans-serif`,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            fontFamily: `"Chakra Petch", "Segoe UI", "Helvetica Neue", sans-serif`,
          },
        },
      },
    },
  });
