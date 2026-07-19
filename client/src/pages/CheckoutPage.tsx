import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle, Smartphone, RefreshCw } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { apiRequest } from '../utils/api'
import { SOCIETY_CONFIG, formatPrice } from '../data/mockData'
import OrderSummary from '../components/OrderSummary'
import UploadCard from '../components/UploadCard'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'

type Step = 1 | 2

const HANDLING_FEE = 49

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const { user, loading: authLoading, login } = useAuth()
  const [step, setStep] = useState<Step>(1)
  const [paymentScreenshot, setPaymentScreenshot] = useState('')
  const [placing, setPlacing] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState('')

  const totalAmount = totalPrice + HANDLING_FEE

  const handlePlaceOrder = async () => {
    if (!paymentScreenshot) return
    setPlacing(true)
    try {
      const orderItems = items.map(item => ({
        product: item.product.id,
        quantity: item.quantity,
        selectedPosition: item.selectedPosition,
        userInputValues: item.userInputValues
      }))
      const payload = {
        items: orderItems,
        totalPrice: totalAmount,
        paymentScreenshot
      }
      const data = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      if (data && data.order) {
        setCreatedOrderId(data.order.orderId)
        clearCart()
        setStep(2)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to place order: ' + (err as Error).message)
    } finally {
      setPlacing(false)
      window.scrollTo(0, 0)
    }
  }

  const steps = [
    { n: 1, label: 'Payment' },
    { n: 2, label: 'Confirmed' },
  ]

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <RefreshCw size={24} className="animate-spin text-accent mb-4" />
          <p className="text-sm text-muted-foreground">Checking authentication status...</p>
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
            <Smartphone size={30} className="text-accent" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-foreground">Login Required</h2>
            <p className="text-sm text-muted-foreground">
              Please sign in with your society account to proceed with checkout and place your order.
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

  if (items.length === 0 && step !== 2) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center">
          <EmptyState variant="cart" actionLabel="Browse products" onAction={() => navigate('/products')} />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Cart
        </Link>

        {/* Stepper */}
        <div className="flex items-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step > s.n ? 'bg-accent text-accent-foreground' :
                  step === s.n ? 'bg-primary text-primary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {step > s.n ? <CheckCircle size={14} /> : s.n}
                </div>
                <p className={`text-xs font-medium ${step === s.n ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-3 mb-4 transition-colors duration-300 ${step > s.n ? 'bg-accent' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Payment */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-6">
                <h2 className="font-semibold text-foreground">Payment</h2>

                {/* QR Section */}
                <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-xl bg-muted/40 text-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Smartphone size={16} />
                    <p className="text-sm font-medium">Scan & Pay via UPI</p>
                  </div>

                  {/* QR placeholder */}
                  <div className="w-44 h-44 bg-white border border-border rounded-xl flex items-center justify-center shadow-sm">
                    <div className="grid grid-cols-7 gap-0.5 p-2">
                      {Array.from({ length: 49 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-[2px]"
                          style={{ backgroundColor: Math.random() > 0.5 ? '#09090b' : 'transparent' }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-2xl font-bold text-foreground">{formatPrice(totalAmount)}</p>
                    <p className="text-sm text-muted-foreground">UPI: <span className="font-mono text-foreground">{SOCIETY_CONFIG.upiId}</span></p>
                  </div>

                  <p className="text-xs text-muted-foreground max-w-xs">
                    Open any UPI app (GPay, PhonePe, Paytm) and scan this QR, or pay directly to the UPI ID above.
                    Take a screenshot of the payment confirmation.
                  </p>
                </div>

                {/* Upload proof */}
                <UploadCard
                  label="Upload Payment Screenshot *"
                  value={paymentScreenshot}
                  onChange={setPaymentScreenshot}
                  hint="Clear screenshot showing transaction ID and amount"
                />

                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => navigate('/cart')}>
                    <ArrowLeft size={14} />
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    disabled={!paymentScreenshot}
                    loading={placing}
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <OrderSummary showItems />
            </div>
          </div>
        )}

        {/* Step 2: Success */}
        {step === 2 && (
          <div className="flex flex-col items-center text-center gap-6 py-16 animate-fade-in">
            <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle size={36} className="text-emerald-500" />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-foreground">Order Placed!</h2>
              <p className="text-muted-foreground">
                We've received your order and payment proof. You'll get a confirmation soon.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Order ID: <span className="font-mono font-semibold text-foreground">{createdOrderId}</span>
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-xs mt-2">
              <Link to={`/orders/${createdOrderId}`}>
                <Button variant="primary" size="lg" className="w-full">
                  Track Order Status
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
