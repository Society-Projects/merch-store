import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  CreditCard, CheckCircle, Package, Clock, MapPin, Check, ArrowLeft, RefreshCw, AlertTriangle
} from 'lucide-react'
import { apiRequest } from '../utils/api'
import Footer from '../components/Footer'
import Button from '../components/Button'

interface TimelineStep {
  id: string
  label: string
  desc: string
  icon: React.ReactNode
}

const TIMELINE: TimelineStep[] = [
  { id: 'pending', label: 'Pending Payment', desc: 'Waiting for payment verification', icon: <CreditCard size={16} /> },
  { id: 'verified', label: 'Payment Verified', desc: 'Payment confirmed by the team', icon: <CheckCircle size={16} /> },
  { id: 'packed', label: 'Order Packed', desc: 'Your items have been packed', icon: <Package size={16} /> },
  { id: 'ready', label: 'Ready for Pickup', desc: 'Visit the collection point on campus', icon: <MapPin size={16} /> },
  { id: 'completed', label: 'Completed', desc: 'Order collected. Thank you!', icon: <Check size={16} /> },
]

const STATUS_INDEX: Record<string, number> = {
  pending: 0,
  verified: 1,
  packed: 2,
  ready: 3,
  completed: 4,
}

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<any | null>(null)
  const [currentStatus, setCurrentStatus] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchOrder = async (showRefresh = false) => {
    if (!id) return
    if (showRefresh) setRefreshing(true)
    try {
      const data = await apiRequest(`/orders/${id}`)
      if (data && data.order) {
        setOrder(data.order)
        setCurrentStatus(data.order.status || 'pending')
      }
    } catch (err) {
      console.error('Failed to fetch order:', err)
      setOrder(null)
    } finally {
      setLoading(false)
      if (showRefresh) setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [id])

  const activeIndex = STATUS_INDEX[currentStatus] ?? 0

  const handleRefresh = () => {
    fetchOrder(true)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-28 w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw size={24} className="animate-spin text-accent" />
            <p className="text-sm text-muted-foreground">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-20 w-full flex flex-col items-center justify-center gap-4 text-center">
          <AlertTriangle size={36} className="text-amber-500" />
          <h2 className="text-xl font-bold text-foreground">Order Not Found</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            We couldn't retrieve details for order <span className="font-mono font-semibold">{id}</span>. Please verify the ID or check back later.
          </p>
          <Link to="/">
            <Button variant="primary">Back to Store</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Store
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest">Order Tracking</p>
            <h1 className="text-2xl font-bold text-foreground">Order Status</h1>
            <p className="text-sm text-muted-foreground font-mono">{id}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            loading={refreshing}
            onClick={handleRefresh}
          >
            <RefreshCw size={13} />
            Refresh
          </Button>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl mb-8">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
            currentStatus === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
            currentStatus === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
            'bg-accent/10 text-accent'
          }`}>
            {TIMELINE[activeIndex].icon}
          </div>
          <div>
            <p className="font-semibold text-foreground">{TIMELINE[activeIndex].label}</p>
            <p className="text-xs text-muted-foreground">{TIMELINE[activeIndex].desc}</p>
          </div>
          {currentStatus !== 'completed' && (
            <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
              <Clock size={11} />
              Processing
            </span>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-6">Order Timeline</h2>

          <div className="flex flex-col gap-0">
            {TIMELINE.map((step, i) => {
              const done = i < activeIndex
              const active = i === activeIndex
              const upcoming = i > activeIndex

              return (
                <div key={step.id} className="flex gap-4">
                  {/* Line + circle */}
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                      done ? 'border-accent bg-accent text-accent-foreground' :
                      active ? 'border-primary bg-primary text-primary-foreground' :
                      'border-border bg-background text-muted-foreground'
                    }`}>
                      {done ? <Check size={13} /> : step.icon}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className={`w-px flex-1 my-1 min-h-[2rem] transition-colors duration-300 ${
                        done ? 'bg-accent' : 'bg-border'
                      }`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`pb-6 flex flex-col gap-0.5 ${i === TIMELINE.length - 1 ? 'pb-0' : ''}`}>
                    <p className={`text-sm font-semibold leading-tight ${
                      upcoming ? 'text-muted-foreground' : 'text-foreground'
                    }`}>
                      {step.label}
                    </p>
                    <p className={`text-xs ${upcoming ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
                      {step.desc}
                    </p>
                    {done && (
                      <p className="text-xs text-accent font-medium mt-0.5">✓ Completed</p>
                    )}
                    {active && currentStatus !== 'completed' && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                        <p className="text-xs text-accent font-medium">In progress</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Info */}
        {currentStatus === 'ready' && (
          <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={14} className="text-emerald-600" />
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Ready for Pickup</p>
            </div>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
              Your order is at the Chapter Desk, Block C, Room 204. Bring your order ID and college ID for collection.
            </p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Link to="/products" className="flex-1">
            <Button variant="outline" className="w-full">Browse More</Button>
          </Link>
          <a href="mailto:merch@example.com" className="flex-1">
            <Button variant="ghost" className="w-full">Contact Support</Button>
          </a>
        </div>
      </div>
      <Footer />
    </div>
  )
}
