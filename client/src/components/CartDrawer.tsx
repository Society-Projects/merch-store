import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../data/mockData'
import Button from './Button'
import EmptyState from './EmptyState'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart()

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={closeCart}
      />

      <div className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-background border-l border-border z-50 flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-foreground" />
            <h2 className="font-semibold text-foreground">Cart</h2>
            {totalItems > 0 && (
              <span className="h-5 min-w-5 px-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <EmptyState variant="cart" actionLabel="Browse products" onAction={closeCart} />
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {items.map(item => (
                <div key={item.cartId} className="p-5 flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground leading-tight">{item.product.name}</p>
                      <button
                        onClick={() => removeItem(item.cartId)}
                        className="text-muted-foreground hover:text-red-500 transition-colors cursor-pointer shrink-0 mt-0.5"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    {item.selectedPosition && (
                      <p className="text-xs text-muted-foreground">Position: {item.selectedPosition}</p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-border flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-bold text-foreground">{formatPrice(totalPrice)}</span>
            </div>
            <Link to="/checkout" onClick={closeCart} className="block">
              <Button variant="primary" className="w-full">Proceed to Checkout</Button>
            </Link>
            <Link to="/cart" onClick={closeCart} className="block">
              <Button variant="outline" className="w-full">View Cart</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
