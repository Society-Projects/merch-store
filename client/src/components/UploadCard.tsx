import { useRef, useState, type ChangeEvent } from 'react'
import { Upload, CheckCircle, X, RefreshCw } from 'lucide-react'

interface UploadCardProps {
  label: string
  value: string
  onChange: (filename: string) => void
  accept?: string
  hint?: string
}

const getFriendlyName = (url: string) => {
  if (!url) return '';
  try {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const fileName = lastPart.split('?')[0].split('#')[0];
    return decodeURIComponent(fileName);
  } catch (e) {
    return 'Uploaded file';
  }
}

export default function UploadCard({
  label,
  value,
  onChange,
  accept = 'image/*',
  hint = 'PNG, JPG up to 10MB',
}: UploadCardProps) {
  const ref = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      try {
        const res = await fetch('/api/v1/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, fileName: file.name })
        })
        const json = await res.json()
        if (res.ok && json.data?.url) {
          onChange(json.data.url)
        } else {
          alert(json.message || 'Failed to upload image')
        }
      } catch (err) {
        console.error('Upload error:', err)
        alert('Upload error: ' + (err as Error).message)
      } finally {
        setUploading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={handleChange} disabled={uploading} />

      {uploading ? (
        <div className="w-full border-2 border-dashed border-muted rounded-xl p-6 flex flex-col items-center gap-2 text-muted-foreground bg-muted/5">
          <RefreshCw size={22} className="animate-spin text-accent" />
          <p className="text-sm font-medium">Uploading image...</p>
          <p className="text-xs opacity-70">Please wait while the file is sent to Cloudinary</p>
        </div>
      ) : value ? (
        <div className="flex items-center gap-3 p-3 border border-border rounded-xl bg-card">
          <CheckCircle size={18} className="text-emerald-500 shrink-0" />
          <p className="text-sm text-foreground font-medium flex-1 truncate">{getFriendlyName(value)}</p>
          <button
            type="button"
            onClick={() => { onChange(''); if (ref.current) ref.current.value = '' }}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-200 cursor-pointer"
        >
          <Upload size={22} />
          <p className="text-sm font-medium">Click to upload</p>
          <p className="text-xs opacity-70">{hint}</p>
        </button>
      )}
    </div>
  )
}
