export const getLanguageFromFileName = (fileName?: string | null): string => {
  if (!fileName) return "javascript"
  const extension = fileName.split(".").pop()?.toLowerCase()

  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "jsx",
    ts: "typescript",
    tsx: "tsx",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    html: "html",
    css: "css",
    json: "json",
    md: "markdown",
    php: "php",
    rb: "ruby",
    go: "go",
    rs: "rust",
    kt: "kotlin",
    swift: "swift",
  }

  return languageMap[extension || ""] || "javascript"
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return "Unknown date"
  }

  try {
    // Try to parse the date string
    const date = new Date(dateString)

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString)
      return "Invalid date"
    }

    // Format the date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    console.error("Error formatting date:", error, "Date string:", dateString)
    return "Invalid date"
  }
}

export const formatDateShort = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return "Unknown"
  }

  try {
    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
      return "Invalid"
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    })
  } catch (error) {
    console.error("Error formatting short date:", error)
    return "Invalid"
  }
}

export const formatRelativeTime = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return "Unknown time"
  }

  try {
    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
      return "Invalid time"
    }

    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "Just now"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days !== 1 ? "s" : ""} ago`
    } else {
      return formatDateShort(dateString)
    }
  } catch (error) {
    console.error("Error formatting relative time:", error)
    return "Invalid time"
  }
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
