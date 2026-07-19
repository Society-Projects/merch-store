import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useToast } from '../contexts/ToastContext'

const icons = {
  success: <CheckCircle size={16} className="text-emerald-500 shrink-0" />,
  error: <XCircle size={16} className="text-red-500 shrink-0" />,
  info: <Info size={16} className="text-blue-500 shrink-0" />,
}

export default function ToastContainer() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="animate-toast-in pointer-events-auto flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-lg min-w-[280px] max-w-sm"
        >
          {icons[t.type]}
          <p className="text-sm text-foreground font-medium flex-1">{t.message}</p>
          <button
            onClick={() => dismiss(t.id)}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
