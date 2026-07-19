import { type ReactNode } from 'react'
import { ShoppingBag, Search, PackageX, AlertCircle } from 'lucide-react'
import Button from './Button'

type EmptyVariant = 'cart' | 'no-products' | 'no-results' | 'unavailable' | 'error'

const config: Record<EmptyVariant, { icon: ReactNode; title: string; desc: string }> = {
  cart: {
    icon: <ShoppingBag size={40} strokeWidth={1.5} />,
    title: 'Your cart is empty',
    desc: 'Browse our collection and add some items to get started.',
  },
  'no-products': {
    icon: <PackageX size={40} strokeWidth={1.5} />,
    title: 'No products yet',
    desc: 'Check back soon — new merchandise drops regularly.',
  },
  'no-results': {
    icon: <Search size={40} strokeWidth={1.5} />,
    title: 'No results found',
    desc: 'Try a different search term or browse all categories.',
  },
  unavailable: {
    icon: <PackageX size={40} strokeWidth={1.5} />,
    title: 'Product unavailable',
    desc: 'This item is currently out of stock or hidden. Check back later.',
  },
  error: {
    icon: <AlertCircle size={40} strokeWidth={1.5} />,
    title: 'Something went wrong',
    desc: 'We hit an unexpected snag. Please try again.',
  },
}

interface EmptyStateProps {
  variant: EmptyVariant
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ variant, actionLabel, onAction }: EmptyStateProps) {
  const { icon, title, desc } = config[variant]
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-4 animate-fade-in">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground max-w-xs">{desc}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
