import { Link } from 'react-router-dom'
import { LayoutDashboard, ArrowLeft, Package, ShoppingCart, Users, BarChart3 } from 'lucide-react'

const cards = [
  { icon: <Package size={20} />, label: 'Products', desc: 'Manage visibility, stock, and pricing', badge: 'Coming soon' },
  { icon: <ShoppingCart size={20} />, label: 'Orders', desc: 'View and update order status', badge: 'Coming soon' },
  { icon: <Users size={20} />, label: 'Members', desc: 'Manage chapter member access', badge: 'Coming soon' },
  { icon: <BarChart3 size={20} />, label: 'Analytics', desc: 'Sales and revenue insights', badge: 'Coming soon' },
]

export default function AdminPlaceholder() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Store
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
            <LayoutDashboard size={18} className="text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">Society merchandise management</p>
          </div>
        </div>

        <div className="p-5 mb-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Admin panel in development</p>
          <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1">
            The admin dashboard is planned for a future release. The UI below shows the intended structure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map(card => (
            <div
              key={card.label}
              className="p-5 bg-card border border-border rounded-2xl flex gap-4 items-start opacity-60"
            >
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
                {card.icon}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{card.label}</p>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {card.badge}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
