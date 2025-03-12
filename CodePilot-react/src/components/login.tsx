import { useState } from "react";
import { loginUser } from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token); // שומר את ה-JWT
      setMessage(`Login successful! Welcome ${data.username}`);
    } catch (error) {
      setMessage("Login failed. Check your credentials.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
