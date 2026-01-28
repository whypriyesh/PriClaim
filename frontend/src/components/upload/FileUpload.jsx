import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader, ShieldCheck, CloudUpload } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import clsx from 'clsx'

export default function FileUpload({ onUploadSuccess, onUploadError }) {
  const { session } = useAuth()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [policies, setPolicies] = useState([])
  const [selectedPolicyId, setSelectedPolicyId] = useState('')
  const fileInputRef = useRef(null)

  // Fetch available policies on mount
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        if (!session?.access_token) return

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/policies`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })

        if (response.ok) {
          const data = await response.json()
          setPolicies(data)
        }
      } catch (err) {
        console.error('Failed to fetch policies:', err)
      }
    }
    fetchPolicies()
  }, [session])

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
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB allowed')
      return
    }

    setFile(file)
  }

  const clearFile = () => {
    setFile(null)
    setUploadProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', file)

    if (selectedPolicyId) {
      formData.append('policy_id', selectedPolicyId)
    }

    try {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          setUploadProgress(Math.round(percentComplete))
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText)
          setFile(null)
          setUploadProgress(0)
          onUploadSuccess?.(data)
          toast.success('Claim uploaded successfully')
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText)
            throw new Error(errorData.detail || 'Upload failed')
          } catch (e) {
            throw new Error('Upload failed with status ' + xhr.status)
          }
        }
        setUploading(false)
      })

      xhr.addEventListener('error', () => {
        setUploading(false)
        setUploadProgress(0)
        onUploadError?.(new Error('Network error'))
        toast.error('Network error during upload')
      })

      xhr.open('POST', `${import.meta.env.VITE_API_URL}/api/v1/ingest`)

      if (session?.access_token) {
        xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`)
      }

      xhr.send(formData)

    } catch (err) {
      setUploading(false)
      setUploadProgress(0)
      onUploadError?.(err)
      toast.error(err.message || 'Upload failed')
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={clsx(
              "cursor-pointer group relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 min-h-[240px] flex flex-col items-center justify-center p-8 text-center",
              isDragging
                ? "border-blue-500 bg-blue-50/50 scale-[1.02] shadow-xl shadow-blue-500/10"
                : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
            )}
          >
            <div className={clsx(
              "w-16 h-16 mb-4 rounded-2xl flex items-center justify-center transition-all duration-300",
              isDragging ? "bg-blue-100 text-blue-600 rotate-12" : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:-translate-y-1"
            )}>
              <CloudUpload strokeWidth={1.5} className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Upload Claim Document</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-[240px]">
              Drag and drop your PDF here, or click to browse files
            </p>
            <div className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              PDF up to 10MB
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="selected"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm relative overflow-hidden"
          >
            {/* File Info */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 truncate pr-8">{file.name}</h4>
                <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              {!uploading && (
                <button
                  onClick={(e) => { e.stopPropagation(); clearFile(); }}
                  className="absolute top-6 right-6 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Policy Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Verify against Policy <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <select
                  value={selectedPolicyId}
                  onChange={(e) => setSelectedPolicyId(e.target.value)}
                  disabled={uploading}
                  className="w-full appearance-none pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
                >
                  <option value="">No specific policy</option>
                  {policies.map(policy => (
                    <option key={policy.id} value={policy.id}>
                      {policy.name} {policy.company_name ? `(${policy.company_name})` : ''}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            {/* Progress Bar or Upload Button */}
            {uploading ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <span>Uploading</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={handleUpload}
                className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
              >
                <Upload className="w-4 h-4" />
                Start Upload & Extraction
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
