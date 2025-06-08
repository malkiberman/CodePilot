"use client"

import { useState, useEffect } from "react"

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const token = sessionStorage.getItem("token")
    setIsAuthenticated(!!token)
    setLoading(false)
  }, [])

  const login = (token: string) => {
    sessionStorage.setItem("token", token)
    setIsAuthenticated(true)
  }

  const logout = () => {
    sessionStorage.removeItem("token")
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    loading,
    login,
    logout,
    setIsAuthenticated,
  }
}
