import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './contexts/ToastContext'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import ToastContainer from './components/Toast'

import LandingPage from './pages/LandingPage'
import ProductListingPage from './pages/ProductListingPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import OrderStatusPage from './pages/OrderStatusPage'
import AdminPlaceholder from './pages/AdminPlaceholder'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <CartProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-background text-foreground flex flex-col">
              <Navbar />
              <main className="flex-1 flex flex-col">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/products" element={<ProductListingPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/orders/:id" element={<OrderStatusPage />} />
                  <Route path="/admin" element={<AdminPlaceholder />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <CartDrawer />
              <ToastContainer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
    </AuthProvider>
  )
}
