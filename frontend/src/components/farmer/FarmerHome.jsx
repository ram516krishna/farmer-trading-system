import React, { useState, useEffect } from 'react'
import { User, Package, IndianRupee, Weight, ShoppingBag, Calendar, TrendingUp } from 'lucide-react'
import { useFarmer } from '../../contexts/FarmerContext'
import toast from 'react-hot-toast'

const FarmerHome = () => {
  const { farmer } = useFarmer()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalWeight: 0,
    totalEarnings: 0,
    paidDeals: 0,
    pendingDeals: 0,
  })

  useEffect(() => {
    const fetchFarmerProducts = async () => {
      if (!farmer?._id) return
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/farmer/${farmer._id}`, {
          credentials: 'include'
        })
        const data = await response.json()
        if (data.success) {
          setProducts(data.data)
          calculateStats(data.data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }

    fetchFarmerProducts()
  }, [farmer])

  const calculateStats = (products) => {
    const stats = {
      totalProducts: products.length,
      totalWeight: products.reduce((sum, p) => sum + (p.weight || 0), 0),
      totalEarnings: products
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + (p.weight * p.rate * p.bagQuantity || 0), 0),
      paidDeals: products.filter(p => p.status === 'paid').length,
      pendingDeals: products.filter(p => p.status === 'pending').length,
    }
    setStats(stats)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <User size={28} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-base-content">
              Welcome, {farmer?.name}!
            </h1>
            <p className="text-base text-base-content/60 mt-1">
              Here's your farming dashboard and product overview
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat bg-base-100 rounded-xl shadow-sm border border-base-300">
          <div className="stat-figure text-primary">
            <Package size={24} />
          </div>
          <div className="stat-title text-base-content/60">Total Products</div>
          <div className="stat-value text-primary">{stats.totalProducts}</div>
        </div>

        <div className="stat bg-base-100 rounded-xl shadow-sm border border-base-300">
          <div className="stat-figure text-secondary">
            <Weight size={24} />
          </div>
          <div className="stat-title text-base-content/60">Total Weight</div>
          <div className="stat-value text-secondary">{stats.totalWeight.toFixed(1)} kg</div>
        </div>

        <div className="stat bg-base-100 rounded-xl shadow-sm border border-base-300">
          <div className="stat-figure text-success">
            <IndianRupee size={24} />
          </div>
          <div className="stat-title text-base-content/60">Total Earnings</div>
          <div className="stat-value text-success">Rs. {stats.totalEarnings.toFixed(2)}</div>
        </div>

        <div className="stat bg-base-100 rounded-xl shadow-sm border border-base-300">
          <div className="stat-figure text-warning">
            <TrendingUp size={24} />
          </div>
          <div className="stat-title text-base-content/60">Paid Deals</div>
          <div className="stat-value text-warning">{stats.paidDeals}</div>
        </div>
      </div>

      {/* Farmer Information */}
      <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-6">
        <h2 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
          <User size={20} className="text-primary" />
          Farmer Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="text-sm text-base-content/60">Full Name</span>
              <p className="font-medium text-base-content">{farmer?.name}</p>
            </div>
            <div>
              <span className="text-sm text-base-content/60">Father's Name</span>
              <p className="font-medium text-base-content">{farmer?.fatherName}</p>
            </div>
            <div>
              <span className="text-sm text-base-content/60">Mobile Number</span>
              <p className="font-medium text-base-content">{farmer?.mobile}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="col-span-2">
              <span className="text-sm text-base-content/60">Address</span>
              <p className="font-medium text-base-content">{farmer?.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-6">
        <h2 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
          <Package size={20} className="text-secondary" />
          Recent Products
        </h2>
        
        {products.length === 0 ? (
          <div className="text-center py-8">
            <Package size={48} className="text-base-content/30 mx-auto mb-4" />
            <p className="text-base-content/60">No products found</p>
            <p className="text-sm text-base-content/40 mt-1">Your products will appear here once added</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Material</th>
                  <th>Weight</th>
                  <th>Rate</th>
                  <th>Bags</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id || index}>
                    <td className="font-medium">{product.productName}</td>
                    <td>
                      <span className="badge badge-ghost badge-sm capitalize">
                        {product.material}
                      </span>
                    </td>
                    <td>{product.weight || 0} kg</td>
                    <td>Rs. {product.rate || 0}/kg</td>
                    <td>{product.bagQuantity || 0}</td>
                    <td>
                      <span className={`badge badge-sm ${
                        product.status === 'paid' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-sm text-base-content/60">
                        <Calendar size={14} />
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default FarmerHome
