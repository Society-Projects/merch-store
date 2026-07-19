import { formatPrice } from '../data/mockData'
import { useCart } from '../contexts/CartContext'

interface OrderSummaryProps {
  showItems?: boolean
}

const HANDLING_FEE = 49

export default function OrderSummary({ showItems = true }: OrderSummaryProps) {
  const { items, totalPrice } = useCart()
  const grandTotal = totalPrice + HANDLING_FEE

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
      <h3 className="font-semibold text-foreground">Order Summary</h3>

      {showItems && items.length > 0 && (
        <div className="flex flex-col gap-3 border-b border-border pb-4">
          {items.map(item => (
            <div key={item.cartId} className="flex gap-3 items-start">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-tight truncate">{item.product.name}</p>
                {item.selectedPosition && (
                  <p className="text-xs text-muted-foreground">Size: {item.selectedPosition}</p>
                )}
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-foreground shrink-0">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Handling fee</span>
          <span>{formatPrice(HANDLING_FEE)}</span>
        </div>
        <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-border">
          <span>Total</span>
          <span>{formatPrice(grandTotal)}</span>
        </div>
      </div>
    </div>
  )
}
