import { useState, FormEvent } from "react";
import { Button, TextField, Container, Typography, Box, InputAdornment, Paper } from "@mui/material";
import { Email, Lock, HelpOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

interface LoginProps {
  setIsAuthenticated: (auth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    setEmailError(false);
    setPasswordError(false);
    let valid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      valid = false;
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = await loginUser(email, password);
      sessionStorage.setItem("token", data);
      setIsAuthenticated(true);
      setMessage(`Login successful! Welcome ${data.username}`);

      setTimeout(() => navigate("/files"), 100);
    } catch (error) {
      setMessage("Login failed. Check your credentials.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Paper elevation={3} sx={{ padding: 4, width: "100%", textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          {message && (
            <Typography color={message.includes("successful") ? "success.main" : "error.main"} sx={{ mb: 2 }}>
              {message}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailError ? "Please enter a valid email" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? "Password must be at least 6 characters" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>
          </form>
          <Button onClick={() => setMessage("Redirecting to password recovery...")} sx={{ mt: 2, textTransform: "none" }}>
            <HelpOutline sx={{ mr: 1 }} />
            Forgot Password?
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
