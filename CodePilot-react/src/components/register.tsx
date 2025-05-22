import { useState, FormEvent } from 'react';
import { Button, TextField, Container, Typography, Box, InputAdornment, Paper } from '@mui/material';
import { Email, Lock, Person, AssignmentInd } from '@mui/icons-material';
import { registerUser } from '../services/authService';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    if (!email || !password || !username || !role) {
      setMessage('Please fill in all fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const data = await registerUser(username, email, password, role);
      localStorage.setItem("token", data.token); // שומר את ה-JWT
      setMessage(`Registration successful! Welcome ${data.username}`);
    } catch (error) {
      setMessage("Registration failed. Check your credentials.");
    }

    setIsSubmitting(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
          
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,

        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%", textAlign: "center", color:"primary" }}>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ width: '100%' }}
        >
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Role"
            variant="outlined"
            fullWidth
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AssignmentInd />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </Box>

        {/* הצגת הודעת הצלחה או שגיאה */}
        {message && (
          <Typography variant="body1" color={message.includes('successful') ? 'success.main' : 'error.main'} sx={{ marginTop: 2 }}>
            {message}
          </Typography>
        )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
