import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeft, Package, ShoppingCart, Eye, EyeOff, Plus, Check, Clock, ShieldAlert, FileText, Trash2
} from 'lucide-react'
import { apiRequest } from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { formatPrice } from '../data/mockData'
import Button from '../components/Button'

export default function AdminPlaceholder() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders')
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Product Form State
  const [showProductForm, setShowProductForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 150,
    image: '',
    category: 'Apparel',
    positions: ['EB', 'CORE', 'MEMBER'],
    userInputs: [] as { question: string; isRequired: boolean; isImageInput: boolean }[]
  })
  const [customQuestion, setCustomQuestion] = useState('')
  const [customRequired, setCustomRequired] = useState(false)
  const [customIsImage, setCustomIsImage] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const ordersData = await apiRequest('/orders/all')
      setOrders(ordersData.orders || [])

      const productsData = await apiRequest('/products/all')
      setProducts((productsData.products || []).map((p: any) => ({ ...p, id: p._id })))
    } catch (err) {
      console.error('Failed to load admin data:', err)
      toast('Failed to load admin data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) return
    if (!user || user.role !== 'EB') {
      toast('Access denied. EB members only.', 'error')
      navigate('/')
      return
    }
    fetchData()
  }, [user, authLoading])

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await apiRequest(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      })
      toast(`Order status updated to ${newStatus}`, 'success')
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o))
    } catch (err) {
      toast('Failed to update status', 'error')
    }
  }

  const handleToggleVisibility = async (productId: string, currentVisible: boolean) => {
    try {
      await apiRequest(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ isVisible: !currentVisible })
      })
      toast('Product visibility updated', 'success')
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, isVisible: !currentVisible } : p))
    } catch (err) {
      toast('Failed to update product', 'error')
    }
  }

  const handleAddInput = () => {
    if (!customQuestion.trim()) return
    setNewProduct(prev => ({
      ...prev,
      userInputs: [...prev.userInputs, { question: customQuestion, isRequired: customRequired, isImageInput: customIsImage }]
    }))
    setCustomQuestion('')
    setCustomRequired(false)
    setCustomIsImage(false)
  }

  const handleRemoveInput = (idx: number) => {
    setNewProduct(prev => ({
      ...prev,
      userInputs: prev.userInputs.filter((_, i) => i !== idx)
    }))
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.name || newProduct.price <= 0) {
      toast('Please enter name and valid price', 'error')
      return
    }

    try {
      await apiRequest('/products/create', {
        method: 'POST',
        body: JSON.stringify(newProduct)
      })
      toast('Product created successfully', 'success')
      setShowProductForm(false)
      setNewProduct({
        name: '',
        description: '',
        price: 150,
        image: '',
        category: 'Apparel',
        positions: ['EB', 'CORE', 'MEMBER'],
        userInputs: []
      })
      fetchData()
    } catch (err) {
      toast('Failed to create product: ' + (err as Error).message, 'error')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Clock size={32} className="animate-spin text-accent mb-4" />
        <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Store
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
              <LayoutDashboard size={18} className="text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Control Center</h1>
              <p className="text-xs text-muted-foreground">Society merchandise and order operations</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`h-9 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'orders' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              Manage Orders
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`h-9 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'products' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              Manage Products
            </button>
          </div>
        </div>

        {/* Tab content: Orders */}
        {activeTab === 'orders' && (
          <div className="bg-card border border-border rounded-2xl p-6 overflow-hidden animate-fade-in">
            <h2 className="text-lg font-bold text-foreground mb-4">Merchandise Orders</h2>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders placed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-medium">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Roll No</th>
                      <th className="pb-3">Total Amount</th>
                      <th className="pb-3">Payment Receipt</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Placed At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {orders.map(order => (
                      <tr key={order._id} className="hover:bg-secondary/10">
                        <td className="py-3 font-mono font-medium text-foreground">{order.orderId}</td>
                        <td className="py-3 text-foreground">
                          <div>
                            <p className="font-medium">{order.details?.name}</p>
                            <p className="text-xs text-muted-foreground">{order.details?.email}</p>
                            <p className="text-xs text-muted-foreground">{order.details?.phone}</p>
                          </div>
                        </td>
                        <td className="py-3 text-muted-foreground">{order.details?.rollNo}</td>
                        <td className="py-3 font-medium text-foreground">{formatPrice(order.totalPrice)}</td>
                        <td className="py-3">
                          <a
                            href={order.paymentScreenshot}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                          >
                            <FileText size={13} />
                            View Proof
                          </a>
                        </td>
                        <td className="py-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                            className="bg-background border border-border rounded-lg text-xs font-medium py-1 px-2 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                          >
                            <option value="pending">Pending Payment</option>
                            <option value="verified">Payment Verified</option>
                            <option value="packed">Order Packed</option>
                            <option value="ready">Ready for Pickup</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-3 text-muted-foreground text-xs">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab content: Products */}
        {activeTab === 'products' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Create Product Header & Trigger */}
            <div className="flex justify-between items-center bg-card border border-border rounded-2xl p-5">
              <div>
                <h3 className="font-bold text-foreground">Product Inventory</h3>
                <p className="text-xs text-muted-foreground">Manage details and create new product listings</p>
              </div>
              <Button onClick={() => setShowProductForm(!showProductForm)}>
                <Plus size={16} />
                {showProductForm ? 'Cancel' : 'Create Product'}
              </Button>
            </div>

            {/* Create Product Form */}
            {showProductForm && (
              <form onSubmit={handleCreateProduct} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 animate-fade-in">
                <h3 className="font-bold text-foreground border-b border-border pb-2">Add New Product</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Society Sticker Pack"
                      value={newProduct.name}
                      onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                      className="h-10 px-3 bg-background border border-border rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-foreground">Price (₹) *</label>
                      <input
                        type="number"
                        required
                        value={newProduct.price}
                        onChange={e => setNewProduct(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                        className="h-10 px-3 bg-background border border-border rounded-xl text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-foreground">Category</label>
                      <select
                        value={newProduct.category}
                        onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                        className="h-10 px-3 bg-background border border-border rounded-xl text-sm cursor-pointer"
                      >
                        <option value="Apparel">Apparel</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Drinkware">Drinkware</option>
                        <option value="Tech">Tech</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide a detailed description of materials, colors, details..."
                    value={newProduct.description}
                    onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    className="p-3 bg-background border border-border rounded-xl text-sm resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newProduct.image}
                    onChange={e => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                    className="h-10 px-3 bg-background border border-border rounded-xl text-sm"
                  />
                </div>

                {/* Customisation Questions */}
                <div className="border-t border-border pt-4 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-foreground">Product Customisation Questions</h4>
                  {newProduct.userInputs.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newProduct.userInputs.map((input, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-secondary text-foreground text-xs rounded-full border border-border">
                          <span>{input.question} {input.isRequired ? '*' : ''} ({input.isImageInput ? 'File' : 'Text'})</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveInput(idx)}
                            className="text-muted-foreground hover:text-red-500 font-semibold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-end gap-3 p-3 bg-secondary/30 rounded-xl border border-border/80">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-[10px] font-medium text-muted-foreground">Add Custom Option (e.g. Size, Custom Name)</label>
                      <input
                        type="text"
                        placeholder="e.g. Select Size (S/M/L) or Upload Member ID"
                        value={customQuestion}
                        onChange={e => setCustomQuestion(e.target.value)}
                        className="h-9 px-3 bg-background border border-border rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-4 h-9">
                      <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customRequired}
                          onChange={e => setCustomRequired(e.target.checked)}
                          className="rounded border-border"
                        />
                        <span>Required</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customIsImage}
                          onChange={e => setCustomIsImage(e.target.checked)}
                          className="rounded border-border"
                        />
                        <span>File Input</span>
                      </label>
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={handleAddInput}>
                      Add Question
                    </Button>
                  </div>
                </div>

                <Button type="submit" variant="primary" className="self-end mt-2">
                  Create Listing
                </Button>
              </form>
            )}

            {/* Products Inventory List */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map(prod => (
                  <div key={prod.id} className="border border-border/60 rounded-xl overflow-hidden bg-background flex flex-col gap-3 p-3">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      {prod.image ? (
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No image available</div>
                      )}
                      <span className="absolute top-2 left-2 bg-card/90 backdrop-blur-sm text-foreground text-[10px] px-2 py-0.5 rounded-full border border-border">
                        {prod.category}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                      <h4 className="font-semibold text-foreground text-sm truncate">{prod.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{prod.description || 'No description provided.'}</p>
                      <p className="text-sm font-bold text-foreground mt-1">{formatPrice(prod.price)}</p>
                    </div>

                    <div className="flex justify-between items-center border-t border-border pt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleVisibility(prod.id, prod.isVisible)}
                          className={`h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer`}
                          title={prod.isVisible ? 'Hide Product' : 'Show Product'}
                        >
                          {prod.isVisible ? <Eye size={14} /> : <EyeOff size={14} className="text-red-500" />}
                        </button>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          prod.isVisible ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                        }`}>
                          {prod.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>

                      <div className="flex gap-1 text-[10px] text-muted-foreground font-mono">
                        {prod.positions?.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
