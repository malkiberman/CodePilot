"use client"

import { useState } from "react"
import { diffLines } from "diff"
import type { FileData } from "../types"

export const useFileComparison = (
  fileData: FileData | null,
  displayedContent: string | null,
  fetchFileContent: (filePath: string) => Promise<string>,
) => {
  const [isComparing, setIsComparing] = useState(false)
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null)
  const [comparedContent, setComparedContent] = useState<string | null>(null)
  const [diff, setDiff] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCompare = async (versionId: number | null = null) => {
    if (!fileData || !displayedContent || versionId === null) {
      return
    }

    setIsLoading(true)
    setError(null)
    setSelectedVersionId(versionId)
    setComparedContent(null)
    setDiff([])

    try {
      let content: string

      if (versionId === 0) {
        // Compare with current file (same content)
        content = displayedContent
      } else {
        // Find and fetch the selected version
        const version = fileData.versions.find((v) => v.versionId === versionId)
        if (!version) {
          throw new Error("Version not found")
        }
        content = await fetchFileContent(version.filePath)
      }

      setComparedContent(content)

      // Generate diff
      const diffResult = diffLines(displayedContent, content)
      setDiff(diffResult)
    } catch (error: any) {
      console.error("Error comparing versions:", error)
      setError(error.message || "Failed to compare versions")
      setComparedContent(null)
      setDiff([])
    } finally {
      setIsLoading(false)
    }
  }

  const startCompare = () => {
    setIsComparing(true)
    setSelectedVersionId(null)
    setComparedContent(null)
    setDiff([])
    setError(null)
  }

  const stopCompare = () => {
    setIsComparing(false)
    setSelectedVersionId(null)
    setComparedContent(null)
    setDiff([])
    setError(null)
  }

  return {
    isComparing,
    selectedVersionId,
    comparedContent,
    diff,
    isLoading,
    error,
    handleCompare,
    startCompare,
    stopCompare,
  }
}
