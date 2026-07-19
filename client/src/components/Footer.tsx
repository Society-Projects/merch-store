import { Link } from 'react-router-dom'
import { Shield, GitFork, Mail, ExternalLink } from 'lucide-react'
import { SOCIETY_CONFIG } from '../data/mockData'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                <Shield size={15} className="text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{SOCIETY_CONFIG.shortName}</p>
                <p className="text-xs text-muted-foreground">Merch Store</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Official merchandise for the {SOCIETY_CONFIG.name}. Wear your passion, support the chapter.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-foreground uppercase tracking-widest">Store</p>
            <nav className="flex flex-col gap-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'All Products' },
                { to: '/cart', label: 'Cart' },
              ].map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-foreground uppercase tracking-widest">Contact</p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:merch@example.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail size={13} />
                merch@example.com
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <GitFork size={13} />
                Open Source
                <ExternalLink size={11} />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              UPI: <span className="font-mono text-foreground">{SOCIETY_CONFIG.upiId}</span>
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SOCIETY_CONFIG.name}. Open-source merch platform.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ for student communities
          </p>
        </div>
      </div>
    </footer>
  )
}
