import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../data/mockData'
import OrderSummary from '../components/OrderSummary'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import Footer from '../components/Footer'

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart()

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="flex flex-col gap-2 mb-8">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest">Checkout</p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Your Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center">
            <EmptyState
              variant="cart"
              actionLabel="Browse products"
              onAction={() => {}}
            />
            <Link to="/products" className="mt-2">
              <Button variant="primary">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              {items.map(item => (
                <div
                  key={item.cartId}
                  className="flex gap-4 p-4 bg-card border border-border rounded-2xl animate-fade-in"
                >
                  <Link to={`/products/${item.product.id}`} className="shrink-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted border border-border">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/products/${item.product.id}`}>
                          <p className="font-semibold text-foreground text-sm hover:text-accent transition-colors">{item.product.name}</p>
                        </Link>
                        {item.selectedPosition && (
                          <p className="text-xs text-muted-foreground">Role: {item.selectedPosition}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.cartId)}
                        className="text-muted-foreground hover:text-red-500 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* User input preview */}
                    {Object.entries(item.userInputValues).filter(([, v]) => v).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(item.userInputValues).filter(([, v]) => v).map(([k, v]) => (
                          <span key={k} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full truncate max-w-[120px]">
                            {v}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <p className="font-bold text-foreground">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-2">
                <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft size={14} />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Summary */}
            <div className="flex flex-col gap-4">
              <OrderSummary showItems={false} />
              <Link to="/checkout">
                <Button variant="primary" size="lg" className="w-full">
                  Proceed to Checkout
                  <ArrowRight size={16} />
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
