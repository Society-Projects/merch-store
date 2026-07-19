import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ClipboardList, ArrowRight, RefreshCw, FileText, CheckCircle, Clock, MapPin, AlertTriangle } from 'lucide-react'
import { apiRequest } from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import { formatPrice } from '../data/mockData'
import EmptyState from '../components/EmptyState'
import Footer from '../components/Footer'
import Button from '../components/Button'

export default function OrdersPage() {
  const { user, loading: authLoading, login } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await apiRequest('/orders/me')
      setOrders(data.orders || [])
    } catch (err) {
      console.error('Failed to fetch user orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchOrders()
      } else {
        setLoading(false)
      }
    }
  }, [user, authLoading])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600">
            <Clock size={12} />
            Pending Payment
          </span>
        )
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
            <CheckCircle size={12} />
            Verified
          </span>
        )
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600">
            <MapPin size={12} />
            Ready for Pickup
          </span>
        )
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
            <CheckCircle size={12} />
            Delivered
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600">
            <AlertTriangle size={12} />
            Cancelled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            {status}
          </span>
        )
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <RefreshCw size={24} className="animate-spin text-accent mb-4" />
          <p className="text-sm text-muted-foreground">Loading your orders...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto px-6 py-20 text-center gap-5">
          <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
            <ClipboardList size={30} className="text-accent" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-foreground">Sign in to view orders</h2>
            <p className="text-sm text-muted-foreground">
              Please sign in with your college Google account to view your purchase history and order status.
            </p>
          </div>
          <Button variant="primary" size="lg" className="w-full" onClick={login}>
            Sign In with Google
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full animate-fade-in">
        <div className="flex items-center gap-3 mb-8 border-b border-border pb-5">
          <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
            <ClipboardList size={20} className="text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
            <p className="text-xs text-muted-foreground">View and track all your society merchandise orders</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            variant="no-orders"
            actionLabel="Start shopping"
            onAction={() => navigate('/products')}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div
                key={order._id}
                className="bg-card border border-border hover:border-accent/40 rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 shadow-sm hover:shadow"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-foreground">{order.orderId}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                    <span>{order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}</span>
                    <span>•</span>
                    <span className="font-semibold text-foreground">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={order.paymentScreenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-2 px-3 border border-border rounded-xl bg-secondary/20 hover:bg-secondary/40"
                  >
                    <FileText size={13} />
                    Receipt
                  </a>
                  <Link to={`/orders/${order.orderId}`}>
                    <Button variant="outline" size="sm" className="group">
                      Track Status
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
