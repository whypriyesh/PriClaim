import { useState, useRef } from 'react'

export default function FileUpload({ onUploadSuccess, onUploadError }) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    validateAndSetFile(droppedFile)
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    validateAndSetFile(selectedFile)
  }

  const validateAndSetFile = (file) => {
    setError('')
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max 10MB allowed')
      return
    }

    setFile(file)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/ingest`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Upload failed')
      }

      setFile(null)
      onUploadSuccess?.(data)
    } catch (err) {
      setError(err.message)
      onUploadError?.(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }
          ${file ? 'border-green-500 bg-green-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {file ? (
          <div>
            <span className="material-icons-round text-5xl text-green-500 mb-4">description</span>
            <p className="text-lg font-medium text-slate-900">{file.name}</p>
            <p className="text-sm text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div>
            <span className="material-icons-round text-5xl text-slate-300 mb-4">cloud_upload</span>
            <p className="text-lg font-medium text-slate-700">Drop your claim PDF here</p>
            <p className="text-sm text-slate-500 mt-1">or click to browse</p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Upload Button */}
      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full mt-4 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload Claim'}
        </button>
      )}
    </div>
  )
}