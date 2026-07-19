import { Link } from 'react-router-dom'
import { AlertCircle, Home, ShoppingBag } from 'lucide-react'
import Button from '../components/Button'
import Footer from '../components/Footer'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto px-6 py-20 text-center gap-6 animate-fade-in">
        <div className="h-20 w-20 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500 shrink-0">
          <AlertCircle size={38} />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">404</h1>
          <h2 className="text-xl font-bold text-foreground">Page Not Found</h2>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          <Link to="/" className="flex-1">
            <Button variant="primary" size="lg" className="w-full flex justify-center gap-2">
              <Home size={16} />
              Go Home
            </Button>
          </Link>
          <Link to="/products" className="flex-1">
            <Button variant="outline" size="lg" className="w-full flex justify-center gap-2">
              <ShoppingBag size={16} />
              Shop Merch
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
