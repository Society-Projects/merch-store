import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Package, Star } from 'lucide-react'
import { products, SOCIETY_CONFIG, formatPrice } from '../data/mockData'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import { ProductGridSkeleton } from '../components/LoadingSkeleton'
import Button from '../components/Button'

const features = [
  { icon: <Package size={18} />, title: 'Pickup on Campus', desc: 'Collect your order from our designated pickup point.' },
  { icon: <Shield size={18} />, title: 'QR Payment', desc: 'Secure UPI payment with instant confirmation.' },
  { icon: <Zap size={18} />, title: 'Fast Processing', desc: 'Orders are processed within 3–5 business days.' },
  { icon: <Star size={18} />, title: 'Quality Guaranteed', desc: 'Premium materials reviewed by chapter members.' },
]

export default function LandingPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  const featured = products.filter(p => p.isVisible).slice(0, 4)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background border-b border-border">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-36">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Copy */}
            <div className="flex-1 flex flex-col gap-6 text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 self-center lg:self-start">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  {SOCIETY_CONFIG.name}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
                Wear what you
                <br />
                <span className="text-accent">stand for.</span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Official merchandise for our chapter community. Quality gear, meaningful designs —
                every purchase supports the chapter.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/products">
                  <Button variant="primary" size="lg">
                    Shop Now
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="outline" size="lg">
                    Browse Catalogue
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-4 justify-center lg:justify-start mt-2">
                <div className="flex -space-x-2">
                  {['#818cf8', '#6ee7b7', '#fbbf24', '#f87171'].map((c, i) => (
                    <div key={i} className="h-7 w-7 rounded-full border-2 border-background" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">240+</span> orders placed this semester
                </p>
              </div>
            </div>

            {/* Product collage */}
            <div className="flex-1 grid grid-cols-2 gap-3 max-w-md w-full">
              {products.slice(0, 4).map((p, i) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className={`group relative overflow-hidden rounded-2xl border border-border bg-muted ${i === 0 ? 'row-span-1' : ''}`}
                >
                  <div className="aspect-square">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-semibold leading-tight">{p.name}</p>
                      <p className="text-white/80 text-xs">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-b border-border bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="flex flex-col gap-2">
                <div className="text-accent">{f.icon}</div>
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest">Collection</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Featured Merchandise</h2>
          </div>
          <Link to="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 animate-fade-in">
            {featured.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 w-full">
        <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative flex flex-col gap-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">New drops every semester.</h3>
            <p className="text-sm opacity-70">Stay updated — follow us on our socials for early access.</p>
          </div>
          <Link to="/products" className="relative shrink-0">
            <Button variant="secondary" size="lg">
              Explore All
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
