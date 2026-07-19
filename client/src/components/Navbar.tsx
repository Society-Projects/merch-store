import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, Shield, LayoutDashboard } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { SOCIETY_CONFIG } from '../data/mockData'
import ThemeToggle from './ThemeToggle'
import SearchBar from './SearchBar'

export default function Navbar() {
  const { totalItems, openCart } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (val: string) => {
    setSearch(val)
    if (val.trim()) {
      navigate(`/products?q=${encodeURIComponent(val.trim())}`)
    }
  }

  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/products?q=${encodeURIComponent(search.trim())}`)
      setMobileOpen(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Shield size={15} className="text-accent-foreground" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-foreground leading-tight">{SOCIETY_CONFIG.shortName}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Merch Store</p>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="flex-1 max-w-sm hidden md:block">
            <SearchBar
              value={search}
              onChange={handleSearch}
              placeholder="Search merchandise…"
            />
          </div>

          <div className="flex-1 hidden md:block" />

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/admin"
              className="h-9 px-3 flex items-center gap-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
            >
              <LayoutDashboard size={15} />
              <span>Admin</span>
            </Link>

            <ThemeToggle />

            <button
              onClick={openCart}
              className="relative h-9 w-9 flex items-center justify-center rounded-xl border border-border text-foreground hover:bg-secondary transition-all duration-200 cursor-pointer"
              aria-label="Open cart"
            >
              <ShoppingCart size={16} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4.5 min-w-4.5 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <ThemeToggle />
            <button
              onClick={openCart}
              className="relative h-9 w-9 flex items-center justify-center rounded-xl border border-border text-foreground hover:bg-secondary transition-all cursor-pointer"
            >
              <ShoppingCart size={16} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4.5 min-w-4.5 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-border text-foreground hover:bg-secondary transition-all cursor-pointer"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-3 animate-fade-in">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search merchandise…"
              className="w-full"
            />
            <div onKeyDown={handleSearchKey} />
            <nav className="flex flex-col gap-1">
              <Link
                to="/products"
                onClick={() => setMobileOpen(false)}
                className="h-10 px-3 flex items-center text-sm text-foreground hover:bg-secondary rounded-xl transition-all"
              >
                All Products
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="h-10 px-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all"
              >
                <LayoutDashboard size={14} />
                Admin Dashboard
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
