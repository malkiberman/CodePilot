import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.REACT_APP_API_BASE_URL

export const analyzeCode = async (content: string): Promise<string> => {
  try {
    const token = sessionStorage.getItem("token")

    const response = await axios.post(`${API_BASE_URL}/Ai/analyze`, content, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error: any) {
    console.error("AI analysis failed:", error)
    throw new Error("Failed to analyze code")
  }
}
