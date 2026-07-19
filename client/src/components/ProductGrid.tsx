import type { Product } from '../data/mockData'
import ProductCard from './ProductCard'
import EmptyState from './EmptyState'
import { ProductGridSkeleton } from './LoadingSkeleton'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  onClearFilters?: () => void
}

export default function ProductGrid({ products, loading = false, onClearFilters }: ProductGridProps) {
  if (loading) return <ProductGridSkeleton />

  if (products.length === 0) {
    return (
      <EmptyState
        variant="no-results"
        actionLabel="Clear filters"
        onAction={onClearFilters}
      />
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 animate-fade-in">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
