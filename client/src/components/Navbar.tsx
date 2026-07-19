import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, Shield, LayoutDashboard, LogIn, LogOut, User } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { SOCIETY_CONFIG } from '../data/mockData'
import ThemeToggle from './ThemeToggle'
import SearchBar from './SearchBar'

export default function Navbar() {
  const { totalItems, openCart } = useCart()
  const { user, login, logout } = useAuth()
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
            {user?.role === 'EB' && (
              <Link
                to="/admin"
                className="h-9 px-3 flex items-center gap-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
              >
                <LayoutDashboard size={15} />
                <span>Admin</span>
              </Link>
            )}

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

            <div className="h-4 w-px bg-border mx-1" />

            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-secondary/50 border border-border">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.firstName} className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-semibold">
                      {user.firstName[0]}
                    </div>
                  )}
                  <span className="text-xs font-medium text-foreground max-w-[80px] truncate">{user.firstName}</span>
                </div>
                <button
                  onClick={logout}
                  className="h-9 w-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="h-9 px-4 flex items-center gap-1.5 bg-accent text-accent-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-all duration-200 cursor-pointer"
              >
                <LogIn size={14} />
                <span>Login</span>
              </button>
            )}
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
                className="h-10 px-3 flex items-center text-sm text-foreground hover:bg-secondary rounded-xl transition-all font-medium"
              >
                All Products
              </Link>
              {user?.role === 'EB' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="h-10 px-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all font-medium"
                >
                  <LayoutDashboard size={14} />
                  Admin Dashboard
                </Link>
              )}

              <div className="h-px bg-border my-2" />

              {user ? (
                <div className="flex flex-col gap-2 px-3 py-1">
                  <div className="flex items-center gap-2">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.firstName} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-semibold">
                        {user.firstName[0]}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileOpen(false) }}
                    className="h-10 mt-2 flex items-center justify-center gap-2 border border-border text-red-500 rounded-xl text-sm font-medium hover:bg-red-500/10 transition-all cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { login(); setMobileOpen(false) }}
                  className="h-10 flex items-center justify-center gap-2 bg-accent text-accent-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-all cursor-pointer"
                >
                  <LogIn size={14} />
                  <span>Login with Google</span>
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
