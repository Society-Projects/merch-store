import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle, Smartphone } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { SOCIETY_CONFIG, formatPrice } from '../data/mockData'
import OrderSummary from '../components/OrderSummary'
import UploadCard from '../components/UploadCard'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import Footer from '../components/Footer'

type Step = 1 | 2 | 3

interface Details {
  name: string
  email: string
  phone: string
  rollNo: string
  college: string
  notes: string
}

const HANDLING_FEE = 49

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)
  const [details, setDetails] = useState<Details>({ name: '', email: '', phone: '', rollNo: '', college: '', notes: '' })
  const [paymentScreenshot, setPaymentScreenshot] = useState('')
  const [placing, setPlacing] = useState(false)
  const [orderId] = useState(`ORD-${Date.now().toString().slice(-6)}`)

  const totalAmount = totalPrice + HANDLING_FEE

  const setField = (key: keyof Details) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDetails(prev => ({ ...prev, [key]: e.target.value }))

  const handleStep1 = () => {
    if (!details.name || !details.email || !details.phone || !details.rollNo) return
    setStep(2)
    window.scrollTo(0, 0)
  }

  const handlePlaceOrder = async () => {
    if (!paymentScreenshot) return
    setPlacing(true)
    await new Promise(r => setTimeout(r, 1200))
    clearCart()
    setStep(3)
    setPlacing(false)
    window.scrollTo(0, 0)
  }

  const steps = [
    { n: 1, label: 'Details' },
    { n: 2, label: 'Payment' },
    { n: 3, label: 'Confirmed' },
  ]

  if (items.length === 0 && step !== 3) {
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

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5">
                <h2 className="font-semibold text-foreground">Your Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'name' as const, label: 'Full Name', placeholder: 'Aditya Kumar', required: true },
                    { key: 'email' as const, label: 'Email', placeholder: 'aditya@college.edu', required: true },
                    { key: 'phone' as const, label: 'Phone', placeholder: '+91 98765 43210', required: true },
                    { key: 'rollNo' as const, label: 'Roll Number', placeholder: 'CS21B001', required: true },
                    { key: 'college' as const, label: 'College / Department', placeholder: 'CSE, 3rd Year', required: false },
                  ].map(field => (
                    <div key={field.key} className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground flex items-center gap-1">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type={field.key === 'email' ? 'email' : field.key === 'phone' ? 'tel' : 'text'}
                        value={details[field.key]}
                        onChange={setField(field.key)}
                        placeholder={field.placeholder}
                        className="h-10 px-3.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                  ))}

                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Order Notes (optional)</label>
                    <textarea
                      value={details.notes}
                      onChange={setField('notes')}
                      placeholder="Any special instructions…"
                      rows={2}
                      className="px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="self-end"
                  disabled={!details.name || !details.email || !details.phone || !details.rollNo}
                  onClick={handleStep1}
                >
                  Continue to Payment
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>

            <div>
              <OrderSummary showItems />
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
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
                  <Button variant="outline" onClick={() => setStep(1)}>
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

        {/* Step 3: Success */}
        {step === 3 && (
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
                Order ID: <span className="font-mono font-semibold text-foreground">{orderId}</span>
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-xs mt-2">
              <Link to={`/orders/${orderId}`}>
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
