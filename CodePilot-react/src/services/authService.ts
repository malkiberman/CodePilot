// src/services/authService.ts
import axios from "axios";
import API_BASE_URL from "../config";

export const registerUser = async (username: string, email: string, password: string, role?: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      email,
      password,
      role
    });
    console.log(response.data);
  

    localStorage.setItem("token", response.data.data);

    return response.data;
  } catch (error) {
    console.error("Registration failed", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    console.log(response.data);
    console.log(response.data.data);
    const token = response.data.data;
    console.log("Extracted token:", token);
    
    if (!token) {
        console.error("Token is undefined or null!");
    } else {
        localStorage.setItem("token", String(token));
        console.log("Stored token:", localStorage.getItem("token"));
        sessionStorage.setItem("token", token);
        console.log(sessionStorage.getItem("token"));
        
        setTimeout(() => {
            console.log("Rechecking token:", localStorage.getItem("token"));
           console.log(   sessionStorage.setItem("token", token));
console.log(sessionStorage.getItem("token"));

        }, 1000);
    }
    
    return response.data; // מחזיר את ה-token כנראה
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const changePassword = async (userId: number, oldPassword: string, newPassword: string, token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/change-password`, {
      userId,
      oldPassword,
      newPassword
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("login success");
    
    return response.data;
  } catch (error) {
    console.error("Password change failed", error);
    throw error;
  }
};
