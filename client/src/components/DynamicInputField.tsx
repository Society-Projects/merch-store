import { useRef, useState, type ChangeEvent } from 'react'
import { Upload, Image, RefreshCw } from 'lucide-react'
import type { UserInput } from '../data/mockData'

interface DynamicInputFieldProps {
  input: UserInput
  value: string
  onChange: (id: string, value: string) => void
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

export default function DynamicInputField({ input, value, onChange }: DynamicInputFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const isImage = input.isImage || input.isImageInput
  const isMenu = input.isMenu
  const isText = input.isText || (!isImage && !isMenu)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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
          onChange(input.id, json.data.url)
        } else {
          alert(json.message || 'Failed to upload image')
        }
      } catch (err) {
        console.error('Custom input upload error:', err)
        alert('Upload error: ' + (err as Error).message)
      } finally {
        setUploading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-1">
        {input.question}
        {input.isRequired && <span className="text-red-500">*</span>}
      </label>

      {isMenu ? (
        <select
          value={value}
          onChange={e => onChange(input.id, e.target.value)}
          className="h-10 px-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all cursor-pointer w-full"
        >
          <option value="">Select {input.question.toLowerCase()}…</option>
          {(input.menuOptions || []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : isImage ? (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading ? (
            <div className="w-full border-2 border-dashed border-muted rounded-xl p-5 flex flex-col items-center gap-2 text-muted-foreground bg-muted/5">
              <RefreshCw size={20} className="animate-spin text-accent" />
              <p className="text-sm font-medium">Uploading image...</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-xl p-5 flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer hover:border-accent hover:bg-accent/5 ${value ? 'border-accent bg-accent/5' : 'border-border'
                }`}
            >
              {value ? (
                <>
                  <Image size={20} className="text-accent" />
                  <p className="text-sm font-medium text-accent truncate max-w-[200px]">{getFriendlyName(value)}</p>
                  <p className="text-xs text-muted-foreground">Click to replace</p>
                </>
              ) : (
                <>
                  <Upload size={20} className="text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload image</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, JPEG up to 10MB</p>
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(input.id, e.target.value)}
          placeholder={`Enter ${input.question.toLowerCase()}…`}
          className="h-10 px-3.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
        />
      )}
    </div>
  )
}
