import { useState, FormEvent } from 'react';
import { Button, TextField, Container, Typography, Box, InputAdornment } from '@mui/material';
import { loginUser } from '../services/authService';
import { Email, Lock, HelpOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = await loginUser(email, password);
      sessionStorage.setItem("token", data.data); // שומר את ה-JWT ב-sessionStorage
      setMessage(`Login successful! Welcome ${data.username}`);
      navigate("/upload");
    } catch (error) {
      setMessage("Login failed. Check your credentials.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ width: '100%' }}
        >
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
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
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              marginTop: 2,
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#3f51b5',
              },
            }}
          >
            Login
          </Button>
        </Box>

        {message && (
          <Typography
            variant="body1"
            color={message.includes("successful") ? "green" : "red"}
            sx={{
              marginTop: 2,
              animation: 'fadeIn 1s ease-in-out',
            }}
          >
            {message}
          </Typography>
        )}

        <Button
          onClick={() => setMessage("Redirecting to password recovery...")}
          sx={{ marginTop: 2, textTransform: 'none' }}
        >
          <HelpOutline sx={{ marginRight: 1 }} />
          Forgot Password?
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
