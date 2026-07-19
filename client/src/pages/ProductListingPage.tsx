import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import { apiRequest } from '../utils/api'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'
import Footer from '../components/Footer'

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
]

export default function ProductListingPage() {
  const [params, setParams] = useSearchParams()
  const [productsList, setProductsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('default')
  const [sortOpen, setSortOpen] = useState(false)

  const q = params.get('q') || ''

  useEffect(() => {
    setLoading(true)
    apiRequest('/products')
      .then(data => {
        const formatted = (data.products || []).map((p: any) => ({ ...p, id: p._id }))
        setProductsList(formatted)
      })
      .catch(err => {
        console.error('Failed to fetch products:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const setSearch = (val: string) => {
    const p = new URLSearchParams(params)
    if (val) p.set('q', val); else p.delete('q')
    setParams(p)
  }

  const filtered = useMemo(() => {
    let list = productsList.filter(p => p.isVisible)
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase()))

    switch (sort) {
      case 'price-asc': return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc': return [...list].sort((a, b) => b.price - a.price)
      case 'name-asc': return [...list].sort((a, b) => a.name.localeCompare(b.name))
      default: return list
    }
  }, [productsList, q, sort])

  const clearFilters = () => {
    setParams({})
    setSort('default')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest">Catalogue</p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">All Products</h1>
          {/* <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'}{cat !== 'All' ? ` in ${cat}` : ''}
            {q ? ` matching "${q}"` : ''}
          </p> */}
        </div>

        {/* Filters toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <SearchBar
            value={q}
            onChange={setSearch}
            placeholder="Search products…"
            className="flex-1"
          />

          {/* Sort dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setSortOpen(o => !o)}
              className="h-10 px-4 flex items-center gap-2 border border-border rounded-xl text-sm text-foreground bg-background hover:bg-secondary transition-all cursor-pointer"
            >
              <SlidersHorizontal size={14} className="text-muted-foreground" />
              {SORT_OPTIONS.find(o => o.value === sort)?.label}
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden animate-fade-in">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false) }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${sort === opt.value
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-foreground hover:bg-secondary'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product grid */}
        <ProductGrid products={filtered} loading={loading} onClearFilters={clearFilters} />
      </div>

      <Footer />
    </div>
  )
}
