import { useRef, type ChangeEvent } from 'react'
import { Upload, CheckCircle, X } from 'lucide-react'

interface UploadCardProps {
  label: string
  value: string
  onChange: (filename: string) => void
  accept?: string
  hint?: string
}

export default function UploadCard({
  label,
  value,
  onChange,
  accept = 'image/*',
  hint = 'PNG, JPG up to 10MB',
}: UploadCardProps) {
  const ref = useRef<HTMLInputElement>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onChange(file.name)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={handleChange} />

      {value ? (
        <div className="flex items-center gap-3 p-3 border border-border rounded-xl bg-card">
          <CheckCircle size={18} className="text-emerald-500 shrink-0" />
          <p className="text-sm text-foreground font-medium flex-1 truncate">{value}</p>
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
