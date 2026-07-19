import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeft, Package, ShoppingCart, Eye, EyeOff, Plus, Check, Clock, ShieldAlert, FileText, Trash2, X, ExternalLink, RefreshCw, Pencil
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
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)

  // Product Form State
  const [showProductForm, setShowProductForm] = useState(false)
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 150,
    image: '',
    positions: ['EB', 'CORE', 'MEMBER'],
    userInputs: [] as {
      question: string;
      isRequired: boolean;
      isImageInput: boolean;
      isText: boolean;
      isImage: boolean;
      isMenu: boolean;
      menuOptions: string[];
    }[]
  })
  const [customQuestion, setCustomQuestion] = useState('')
  const [customRequired, setCustomRequired] = useState(false)
  const [customInputType, setCustomInputType] = useState<'text' | 'image' | 'menu'>('text')
  const [customMenuOptions, setCustomMenuOptions] = useState('')

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

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderId}?`)) return
    try {
      await apiRequest(`/orders/${orderId}`, {
        method: 'DELETE'
      })
      toast('Order deleted successfully', 'success')
      setOrders(prev => prev.filter(o => o.orderId !== orderId))
    } catch (err) {
      toast('Failed to delete order: ' + (err as Error).message, 'error')
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
    const options = customInputType === 'menu'
      ? customMenuOptions.split(',').map(o => o.trim()).filter(Boolean)
      : []

    if (customInputType === 'menu' && options.length === 0) {
      toast('Please enter at least one menu option', 'error')
      return
    }

    setNewProduct(prev => ({
      ...prev,
      userInputs: [...prev.userInputs, {
        question: customQuestion,
        isRequired: customRequired,
        isImageInput: customInputType === 'image',
        isText: customInputType === 'text',
        isImage: customInputType === 'image',
        isMenu: customInputType === 'menu',
        menuOptions: options
      }]
    }))
    setCustomQuestion('')
    setCustomRequired(false)
    setCustomInputType('text')
    setCustomMenuOptions('')
  }

  const handleRemoveInput = (idx: number) => {
    setNewProduct(prev => ({
      ...prev,
      userInputs: prev.userInputs.filter((_, i) => i !== idx)
    }))
  }

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        try {
          const base64 = reader.result as string
          const resData = await apiRequest('/upload', {
            method: 'POST',
            body: JSON.stringify({ base64 })
          })
          setNewProduct(prev => ({ ...prev, image: resData.url }))
          toast('Product image uploaded successfully', 'success')
        } catch (err) {
          toast('Upload failed: ' + (err as Error).message, 'error')
        } finally {
          setUploadingImage(false)
        }
      }
    } catch (err) {
      toast('Failed to read image file', 'error')
      setUploadingImage(false)
    }
  }

  const handleCancelForm = () => {
    setShowProductForm(false)
    setEditingProductId(null)
    setNewProduct({
      name: '',
      description: '',
      price: 150,
      image: '',
      positions: ['EB', 'CORE', 'MEMBER'],
      userInputs: []
    })
  }

  const handleEditProduct = (prod: any) => {
    setEditingProductId(prod.id)
    setNewProduct({
      name: prod.name,
      description: prod.description || '',
      price: prod.price,
      image: prod.image || '',
      positions: prod.positions || ['EB', 'CORE', 'MEMBER'],
      userInputs: (prod.userInputs || []).map((ui: any) => ({
        question: ui.question,
        isRequired: ui.isRequired,
        isImageInput: ui.isImageInput || ui.isImage || false,
        isText: ui.isText !== undefined ? ui.isText : (!ui.isImage && !ui.isMenu && !ui.isImageInput),
        isImage: ui.isImage !== undefined ? ui.isImage : (ui.isImageInput || false),
        isMenu: ui.isMenu || false,
        menuOptions: ui.menuOptions || []
      }))
    })
    setShowProductForm(true)
    setImageMode(prod.image ? 'url' : 'upload')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to delete product "${productName}"?`)) return
    try {
      await apiRequest(`/products/${productId}`, {
        method: 'DELETE'
      })
      toast('Product deleted successfully', 'success')
      fetchData()
    } catch (err) {
      toast('Failed to delete product: ' + (err as Error).message, 'error')
    }
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.name || newProduct.price <= 0) {
      toast('Please enter name and valid price', 'error')
      return
    }

    try {
      if (editingProductId) {
        await apiRequest(`/products/${editingProductId}`, {
          method: 'PUT',
          body: JSON.stringify(newProduct)
        })
        toast('Product updated successfully', 'success')
      } else {
        await apiRequest('/products/create', {
          method: 'POST',
          body: JSON.stringify(newProduct)
        })
        toast('Product created successfully', 'success')
      }
      handleCancelForm()
      fetchData()
    } catch (err) {
      toast('Failed to save product: ' + (err as Error).message, 'error')
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
                      <th className="pb-3">Position</th>
                      <th className="pb-3">Total Amount</th>
                      <th className="pb-3">Payment Receipt</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Placed At</th>
                      <th className="pb-3 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {orders.map(order => (
                      <tr key={order._id} className="hover:bg-secondary/10">
                        <td className="py-3">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="font-mono font-medium text-accent hover:underline cursor-pointer"
                          >
                            {order.orderId}
                          </button>
                        </td>
                        <td className="py-3 text-foreground">
                          <div>
                            <p className="font-medium">{order.details?.name}</p>
                            <p className="text-xs text-muted-foreground">{order.details?.email}</p>
                            <p className="text-xs text-muted-foreground">{order.details?.phone}</p>
                          </div>
                        </td>
                        <td className="py-3 text-muted-foreground font-medium">{order.userId?.role || 'Guest'}</td>
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
                            <option value="ready">Ready for Pickup</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 text-muted-foreground text-xs">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-right pr-4">
                          <div className="flex justify-end gap-1.5 ml-auto">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all cursor-pointer inline-flex"
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.orderId)}
                              className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer inline-flex animate-fade-in"
                              title="Delete Order"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
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
              <Button onClick={() => { if (showProductForm) { handleCancelForm() } else { setShowProductForm(true) } }}>
                <Plus size={16} />
                {showProductForm ? 'Cancel' : 'Create Product'}
              </Button>
            </div>

            {/* Create Product Form */}
            {showProductForm && (
              <form onSubmit={handleCreateProduct} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 animate-fade-in">
                <h3 className="font-bold text-foreground border-b border-border pb-2">{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>

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
                  <label className="text-xs font-semibold text-foreground">Product Image</label>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setImageMode('upload')}
                        className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-all ${
                          imageMode === 'upload' ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-foreground border-border hover:bg-secondary/80'
                        }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-all ${
                          imageMode === 'url' ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-foreground border-border hover:bg-secondary/80'
                        }`}
                      >
                        Direct URL
                      </button>
                    </div>

                    {imageMode === 'url' ? (
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={newProduct.image}
                        onChange={e => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                        className="h-10 px-3 bg-background border border-border rounded-xl text-sm w-full"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleProductImageUpload}
                          className="hidden"
                          id="admin-product-image-file"
                          disabled={uploadingImage}
                        />
                        <label
                          htmlFor="admin-product-image-file"
                          className="h-10 px-4 flex items-center justify-center gap-2 border border-dashed border-border rounded-xl text-xs font-semibold hover:border-accent hover:bg-accent/5 transition-all cursor-pointer bg-background flex-1 text-muted-foreground"
                        >
                          {uploadingImage ? (
                            <>
                              <RefreshCw className="animate-spin text-accent" size={14} />
                              <span>Uploading...</span>
                            </>
                          ) : newProduct.image ? (
                            <span>Change Image file</span>
                          ) : (
                            <span>Choose Image file</span>
                          )}
                        </label>
                        {newProduct.image && (
                          <div className="h-10 w-10 rounded-lg overflow-hidden border border-border shrink-0">
                            <img src={newProduct.image} alt="Uploaded preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Customisation Questions */}
                <div className="border-t border-border pt-4 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-foreground">Product Customisation Questions</h4>
                  {newProduct.userInputs.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newProduct.userInputs.map((input, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-secondary text-foreground text-xs rounded-full border border-border">
                          <span>
                            {input.question} {input.isRequired ? '*' : ''} ({
                              input.isMenu ? `Menu: ${input.menuOptions?.join(', ')}` :
                              input.isImage || input.isImageInput ? 'File' : 'Text'
                            })
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveInput(idx)}
                            className="text-muted-foreground hover:text-red-500 font-semibold animate-fade-in"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col gap-3 p-3 bg-secondary/30 rounded-xl border border-border/80">
                    <div className="flex flex-col sm:flex-row items-end gap-3 w-full">
                      <div className="flex-1 flex flex-col gap-1.5 w-full">
                        <label className="text-[10px] font-medium text-muted-foreground">Add Custom Option (e.g. Size, Custom Name)</label>
                        <input
                          type="text"
                          placeholder="e.g. Select Size or Upload Member ID"
                          value={customQuestion}
                          onChange={e => setCustomQuestion(e.target.value)}
                          className="h-9 px-3 bg-background border border-border rounded-lg text-xs w-full"
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-start sm:items-end">
                        <div className="flex flex-col gap-1 w-full sm:w-40">
                          <label className="text-[10px] font-medium text-muted-foreground">Input Type</label>
                          <select
                            value={customInputType}
                            onChange={e => setCustomInputType(e.target.value as any)}
                            className="h-9 px-2 bg-background border border-border rounded-lg text-xs cursor-pointer focus:outline-none"
                          >
                            <option value="text">Text Input</option>
                            <option value="image">File (Image)</option>
                            <option value="menu">Dropdown (Menu)</option>
                          </select>
                        </div>

                        {customInputType === 'menu' && (
                          <div className="flex flex-col gap-1.5 w-full sm:w-48">
                            <label className="text-[10px] font-medium text-muted-foreground">Menu Options (comma-separated)</label>
                            <input
                              type="text"
                              placeholder="e.g. XS, S, M, L, XL"
                              value={customMenuOptions}
                              onChange={e => setCustomMenuOptions(e.target.value)}
                              className="h-9 px-3 bg-background border border-border rounded-lg text-xs w-full animate-fade-in"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-4 h-9 min-w-fit px-1">
                          <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={customRequired}
                              onChange={e => setCustomRequired(e.target.checked)}
                              className="rounded border-border"
                            />
                            <span>Required</span>
                          </label>
                        </div>

                        <Button type="button" size="sm" variant="outline" onClick={handleAddInput}>
                          Add Option
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="primary" className="self-end mt-2">
                  {editingProductId ? 'Update Listing' : 'Create Listing'}
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
                      {prod.positions && prod.positions.length > 0 && (
                        <span className="absolute top-2 left-2 bg-card/90 backdrop-blur-sm text-foreground text-[9px] px-2 py-0.5 rounded-full border border-border font-mono">
                          {prod.positions.join(', ')}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                      <h4 className="font-semibold text-foreground text-sm truncate">{prod.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{prod.description || 'No description provided.'}</p>
                      <p className="text-sm font-bold text-foreground mt-1">{formatPrice(prod.price)}</p>
                    </div>                     <div className="flex justify-between items-center border-t border-border pt-3">
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

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEditProduct(prod)}
                          className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all cursor-pointer"
                          title="Edit Product"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-fade-in overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="font-bold text-foreground text-base">Order Details</h3>
                <p className="text-xs text-muted-foreground">ID: {selectedOrder.orderId}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 text-left">
              {/* Customer & Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-border/60 bg-muted/20">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Customer Details</h4>
                  <p className="text-sm font-semibold text-foreground">{selectedOrder.details?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.details?.email}</p>
                  {selectedOrder.details?.phone && <p className="text-xs text-muted-foreground">{selectedOrder.details.phone}</p>}
                  <div className="mt-1">
                    <span className="text-[10px] bg-secondary text-secondary-foreground font-semibold px-2 py-0.5 rounded-full border border-border">
                      Role: {selectedOrder.userId?.role || 'Guest'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-border/60 bg-muted/20">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status & Summary</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">Current Status:</span>
                    <span className="capitalize text-xs font-medium text-foreground px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Placed: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p className="text-sm font-bold text-foreground mt-1">Total Amount: {formatPrice(selectedOrder.totalPrice)}</p>
                </div>
              </div>

              {/* Items Customisation Details */}
              <div className="flex flex-col gap-4">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Items & Customisations</h4>
                <div className="flex flex-col gap-3">
                  {selectedOrder.items?.map((item: any, idx: number) => {
                    const hasInputs = item.userInputValues && Object.keys(item.userInputValues).length > 0;
                    return (
                      <div key={idx} className="border border-border/60 rounded-xl p-4 flex flex-col gap-3 bg-muted/10">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{item.product?.name || 'Unknown Product'}</p>
                            {item.selectedPosition && (
                              <p className="text-xs text-muted-foreground mt-0.5">Position: {item.selectedPosition}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            <p className="text-sm font-semibold text-foreground">{formatPrice((item.product?.price || 0) * item.quantity)}</p>
                          </div>
                        </div>

                        {/* Customisation inputs rendering */}
                        {hasInputs && (
                          <div className="border-t border-border/60 pt-3 flex flex-col gap-2">
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Customisation Details</p>
                            <div className="flex flex-col gap-2">
                              {Object.entries(item.userInputValues).map(([questionId, value]: any) => {
                                const questionText = item.product?.userInputs?.find((ui: any) => ui.id === questionId)?.question || questionId;
                                const isImageUrl = typeof value === 'string' && (
                                  value.startsWith('http') || value.includes('cloudinary.com') || /\.(jpg|jpeg|png|gif|webp)/i.test(value)
                                );

                                return (
                                  <div key={questionId} className="flex flex-col gap-1 text-xs">
                                    <span className="text-muted-foreground font-medium">{questionText}:</span>
                                    {isImageUrl ? (
                                      <div className="mt-1 relative max-w-xs aspect-video rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center group">
                                        <img src={value} alt="User submission" className="w-full h-full object-cover" />
                                        <a
                                          href={value}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1 font-semibold"
                                        >
                                          View Full Image <ExternalLink size={12} />
                                        </a>
                                      </div>
                                    ) : (
                                      <span className="text-foreground font-semibold bg-secondary/40 px-2 py-1 rounded-lg border border-border/40 inline-block w-fit">
                                        {value}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Receipt */}
              {selectedOrder.paymentScreenshot && (
                <div className="flex flex-col gap-2 border-t border-border pt-4">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Payment Receipt Screenshot</h4>
                  <div className="relative max-w-md aspect-video rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center group mt-1">
                    <img src={selectedOrder.paymentScreenshot} alt="Payment Receipt" className="w-full h-full object-cover" />
                    <a
                      href={selectedOrder.paymentScreenshot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1 font-semibold text-xs"
                    >
                      View Full Receipt <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border flex justify-end">
              <Button onClick={() => setSelectedOrder(null)} variant="outline">
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
