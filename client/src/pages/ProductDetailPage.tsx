import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingCart, AlertCircle } from 'lucide-react'
import { products, formatPrice } from '../data/mockData'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import DynamicInputField from '../components/DynamicInputField'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import { ProductDetailSkeleton } from '../components/LoadingSkeleton'
import Footer from '../components/Footer'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [selectedPosition, setSelectedPosition] = useState('')
  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [adding, setAdding] = useState(false)

  const product = products.find(p => p.id === id)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [id])

  const handleInputChange = (fieldId: string, value: string) => {
    setInputValues(prev => ({ ...prev, [fieldId]: value }))
    setErrors(prev => ({ ...prev, [fieldId]: '' }))
  }

  const validate = (): boolean => {
    if (!product) return false
    const newErrors: Record<string, string> = {}

    if (product.positions.length > 0 && !selectedPosition) {
      newErrors._position = 'Please select a size / position'
    }

    product.userInputs.forEach(input => {
      if (input.isRequired && !inputValues[input.id]?.trim()) {
        newErrors[input.id] = `${input.question} is required`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddToCart = async () => {
    if (!validate() || !product) return
    setAdding(true)
    await new Promise(r => setTimeout(r, 400))
    addItem({
      product,
      quantity: qty,
      selectedPosition,
      userInputValues: inputValues,
    })
    toast(`${product.name} added to cart!`, 'success')
    setAdding(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
          <div className="h-8 w-32 bg-muted rounded-lg animate-pulse mb-8" />
          <ProductDetailSkeleton />
        </div>
        <Footer />
      </div>
    )
  }

  if (!product || !product.isVisible) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center">
          <EmptyState variant="unavailable" actionLabel="Back to products" onAction={() => navigate('/products')} />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Breadcrumb */}
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          All Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 animate-fade-in">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm text-card-foreground text-xs font-medium px-2.5 py-1 rounded-full border border-border">
              {product.category}
            </span>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-accent uppercase tracking-widest">{product.category}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{product.name}</h1>
              <p className="text-2xl font-bold text-foreground">{formatPrice(product.price)}</p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Position / Size selector */}
            {product.positions.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-foreground">
                  Size / Position <span className="text-red-500">*</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.positions.map(pos => (
                    <button
                      key={pos}
                      onClick={() => { setSelectedPosition(pos); setErrors(e => ({ ...e, _position: '' })) }}
                      className={`h-9 px-4 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer ${
                        selectedPosition === pos
                          ? 'border-accent bg-accent text-accent-foreground'
                          : 'border-border text-foreground hover:border-accent hover:bg-accent/5'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
                {errors._position && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={11} />{errors._position}
                  </p>
                )}
              </div>
            )}

            {/* Dynamic fields */}
            {product.userInputs.length > 0 && (
              <div className="flex flex-col gap-4 border-t border-border pt-5">
                <p className="text-sm font-semibold text-foreground">Customisation</p>
                {product.userInputs.map(input => (
                  <div key={input.id}>
                    <DynamicInputField
                      input={input}
                      value={inputValues[input.id] || ''}
                      onChange={handleInputChange}
                    />
                    {errors[input.id] && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={11} />{errors[input.id]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Quantity + Add */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-foreground">Quantity</p>
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-foreground">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(10, q + 1))}
                    className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                loading={adding}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={16} />
                Add to Cart — {formatPrice(product.price * qty)}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Payment via UPI QR at checkout · Campus pickup only
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
