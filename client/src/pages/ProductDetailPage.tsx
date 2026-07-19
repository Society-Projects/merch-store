import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingCart, AlertCircle } from 'lucide-react'
import { apiRequest } from '../utils/api'
import { formatPrice } from '../data/mockData'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../contexts/AuthContext'
import DynamicInputField from '../components/DynamicInputField'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import { ProductDetailSkeleton } from '../components/LoadingSkeleton'
import Footer from '../components/Footer'

const renderDescription = (desc: string) => {
  if (!desc) return null
  const urlRegex = /(https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|gif|webp|svg))/gi
  const parts = desc.split(urlRegex)
  const matches = desc.match(urlRegex)

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {parts.map((part) => {
          if (part.match(urlRegex)) return null
          return part
        })}
      </p>
      {matches && matches.map((url, idx) => (
        <div key={idx} className="mt-2 border border-border rounded-xl bg-muted/20 p-2 max-w-lg flex items-center justify-center animate-fade-in">
          <img src={url} alt="Description illustration" className="w-full h-auto object-contain rounded-lg max-h-[400px]" />
        </div>
      ))}
    </div>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { toast } = useToast()
  const { user } = useAuth()

  const [product, setProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [selectedPosition, setSelectedPosition] = useState('')
  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [adding, setAdding] = useState(false)

  // Fetch data
  useEffect(() => {
    if (!id) return
    setLoading(true)
    apiRequest(`/products/${id}`)
      .then(data => {
        if (data && data.product) {
          const p = data.product
          const formatted = {
            ...p,
            id: p._id,
            userInputs: (p.userInputs || []).map((input: any) => ({
              ...input,
              id: input.question
            }))
          }
          setProduct(formatted)
        }
      })
      .catch(err => {
        console.error('Failed to fetch product:', err)
        setProduct(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  const handleInputChange = (fieldId: string, value: string) => {
    setInputValues(prev => ({ ...prev, [fieldId]: value }))
    setErrors(prev => ({ ...prev, [fieldId]: '' }))
  }

  const validate = (): boolean => {
    if (!product) return false
    const newErrors: Record<string, string> = {}

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
      selectedPosition: product.positions.length > 0 ? (user?.role || 'MEMBER') : '',
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
          <div className="relative rounded-2xl overflow-hidden bg-muted/30 border border-border flex items-center justify-center min-h-[300px] max-h-[500px] p-4">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-[460px] object-contain rounded-lg shadow-sm"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{product.name}</h1>
              <p className="text-2xl font-bold text-foreground">{formatPrice(product.price)}</p>
            </div>

            {renderDescription(product.description)}

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
