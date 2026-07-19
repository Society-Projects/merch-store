import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '../data/mockData'
import { formatPrice } from '../data/mockData'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col gap-3 cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted border border-border">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm text-card-foreground text-xs font-medium px-2.5 py-1 rounded-full border border-border">
          {product.category}
        </span> */}

        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
          <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
            <ShoppingCart size={15} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-0.5">
        <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-accent transition-colors duration-200">
          {product.name}
        </p>
        <p className="text-sm font-bold text-foreground">{formatPrice(product.price)}</p>
        {/* {product.positions.length > 0 && (
          <p className="text-xs text-muted-foreground">{product.positions.join(' · ')}</p>
        )} */}
      </div>
    </Link>
  )
}
