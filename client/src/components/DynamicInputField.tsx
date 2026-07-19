import { useRef, type ChangeEvent } from 'react'
import { Upload, Image } from 'lucide-react'
import type { UserInput } from '../data/mockData'

interface DynamicInputFieldProps {
  input: UserInput
  value: string
  onChange: (id: string, value: string) => void
}

export default function DynamicInputField({ input, value, onChange }: DynamicInputFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onChange(input.id, file.name)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-1">
        {input.question}
        {input.isRequired && <span className="text-red-500">*</span>}
      </label>

      {input.isImageInput ? (
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-xl p-5 flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer hover:border-accent hover:bg-accent/5 ${
              value ? 'border-accent bg-accent/5' : 'border-border'
            }`}
          >
            {value ? (
              <>
                <Image size={20} className="text-accent" />
                <p className="text-sm font-medium text-accent truncate max-w-[200px]">{value}</p>
                <p className="text-xs text-muted-foreground">Click to replace</p>
              </>
            ) : (
              <>
                <Upload size={20} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload image</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
              </>
            )}
          </button>
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
