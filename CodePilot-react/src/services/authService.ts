import axios from "axios"
import type { AuthResponse } from "../types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.REACT_APP_API_BASE_URL

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  role = "user",
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      email,
      password,
      role,
    })

    localStorage.setItem("token", response.data.data)
    return response.data
  } catch (error) {
    console.error("Registration failed:", error)
    throw error
  }
}

export const loginUser = async (email: string, password: string): Promise<string> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    })

    const token = response.data.data
    if (!token) {
      throw new Error("No token received from server")
    }

    sessionStorage.setItem("token", String(token))
    return token
  } catch (error) {
    console.error("Login failed:", error)
    throw error
  }
}

export const changePassword = async (userId: number, oldPassword: string, newPassword: string, token: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/change-password`,
      {
        userId,
        oldPassword,
        newPassword,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    return response.data
  } catch (error) {
    console.error("Password change failed:", error)
    throw error
  }
}
