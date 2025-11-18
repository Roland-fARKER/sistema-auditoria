"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, File, AlertCircle, CheckCircle } from "lucide-react"
import type { Evidence } from "@/lib/audit-types"

interface EvidenceUploadProps {
  onUpload: (evidence: Evidence) => void
  existingEvidence: Evidence[]
  onDelete: (url: string) => void
  isLoading?: boolean
}

export function EvidenceUpload({ onUpload, existingEvidence, onDelete, isLoading = false }: EvidenceUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFile = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      // 50MB limit
      setError("El archivo no puede exceder 50MB")
      return
    }

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      onUpload({
        id: Math.random().toString(36).substr(2, 9),
        filename: data.filename,
        url: data.url,
        size: data.size,
        type: data.type,
        uploadedAt: data.uploadedAt,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el archivo")
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Evidencia
        </CardTitle>
        <CardDescription>Carga documentos o archivos como evidencia</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-border"
          }`}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            disabled={uploading}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                {uploading ? "Subiendo..." : "Arrastra archivos aquí o haz clic"}
              </p>
              <p className="text-xs text-muted-foreground">Máximo 50MB por archivo</p>
            </div>
          </label>
        </div>

        {/* Existing Evidence */}
        {existingEvidence.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Archivos subidos:</p>
            <div className="space-y-2">
              {existingEvidence.map((evidence) => (
                <div
                  key={evidence.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{evidence.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(evidence.size)} • {new Date(evidence.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={evidence.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(evidence.url)}
                      disabled={isLoading}
                      className="h-6 w-6"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
