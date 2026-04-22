import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Info, Unlock, Package, Weight, Eye, EyeOff, Lock } from 'lucide-react'


const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEarnings, setShowEarnings] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/stats`,{
        credentials: "include"
      })
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      } else {
        console.error('Failed to fetch dashboard stats')
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
     
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const handleEarningsClick = () => {
    if (!showEarnings) {
      setShowPasswordModal(true)
      setPassword('')
      setPasswordError('')
    }
  }

  const validatePassword = () => {
    // Simple password validation - you can change this to any password you want
    if (password === '2000') {
      setShowEarnings(true)
      setShowPasswordModal(false)
      setPassword('')
      setPasswordError('')
      toast.success('Earnings unlocked successfully')
    } else {
      setPasswordError('Incorrect password')
      toast.error('Invalid password')
    }
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    validatePassword()
  }

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false)
    setPassword('')
    setPasswordError('')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        {/* Total Deals */}
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-primary">
            <Info className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Deals</div>
          <div className="stat-value text-primary">{stats.totalDeals}</div>
          <div className="stat-desc">All farmer deals</div>
        </div>

        {/* Total Earnings */}
        <div 
          className={`stat bg-base-100 shadow-lg rounded-lg cursor-pointer transition-all duration-300 ${
            !showEarnings ? 'hover:bg-base-200' : ''
          }`}
          onClick={handleEarningsClick}
        >
          <div className="stat-figure text-secondary">
            {showEarnings ? <Unlock className="w-8 h-8" onClick={()=>setShowEarnings(false)}/> : <Lock className="w-8 h-8" />}
          </div>
          <div className="stat-title flex items-center gap-2">
            Total Earnings
            {!showEarnings && <Eye size={16} className="text-base-content/40" />}
          </div>
          <div className="stat-value text-secondary">
            {showEarnings ? (
              <span>{stats.totalEarnings.toFixed(2)}</span>
            ) : (
              <span className="text-base-content/30">***.**</span>
            )}
          </div>
          <div className="stat-desc">
            {showEarnings ? 'From paid deals' : 'Click to unlock'}
          </div>
        </div>

        {/* Total Bags */}
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-accent">
            <Package className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Bags</div>
          <div className="stat-value text-accent">{stats.totalBagQuantity}</div>
          <div className="stat-desc">All bag quantities</div>
        </div>

        {/* Total Weight */}
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-warning">
            <Weight className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Weight</div>
          <div className="stat-value text-warning">{stats.totalWeight.toFixed(1)} kg</div>
          <div className="stat-desc">Total product weight</div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deal Status */}
        <div className="bg-base-100 shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Deal Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="">Paid Deals</span>
              <span className="badge badge-success badge-lg">{stats.paidDeals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="">Pending Deals</span>
              <span className="badge badge-warning badge-lg">{stats.pendingDeals}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-success h-2 rounded-full" 
                style={{ width: `${(stats.paidDeals / stats.totalDeals) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              {((stats.paidDeals / stats.totalDeals) * 100).toFixed(1)}% of deals are paid
            </p>
          </div>
        </div>

        {/* Material Distribution */}
        <div className="bg-base-100 shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Material Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats.materialStats).map(([material, count]) => (
              <div key={material} className="flex justify-between items-center">
                <span className="capitalize ">{material}</span>
                <span className="badge badge-ghost badge-lg">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Deals */}
      <div className="bg-base-100 shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Deals</h3>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Material</th>
                <th>Weight</th>
                <th>Rate</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentDeals.map((deal) => (
                <tr key={deal.id}>
                  <td className="font-medium">{deal.name}</td>
                  <td>
                    <span className="badge badge-ghost badge-sm">
                      {deal.material}
                    </span>
                  </td>
                  <td>{deal.weight || '-'} kg</td>
                  <td>Rs. {deal.rate || '-'}</td>
                  <td>
                    <span className={`badge ${deal.status === 'paid' ? 'badge-success' : 'badge-warning'} badge-sm`}>
                      {deal.status}
                    </span>
                  </td>
                  <td>{new Date(deal.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handlePasswordModalClose}
            >
              <EyeOff size={16} />
            </button>
            
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Lock size={20} className="text-warning" />
              Unlock Earnings
            </h3>
            
            <p className="py-2 text-sm text-base-content/60">
              Enter password to view total earnings data
            </p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm font-medium">Password</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="input input-bordered w-full"
                  autoFocus
                />
                {passwordError && (
                  <label className="label">
                    <span className="label-text-alt text-error text-xs">{passwordError}</span>
                  </label>
                )}
              </div>
              
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handlePasswordModalClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Unlock
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={handlePasswordModalClose}></div>
        </div>
      )}
    </div>
  )
}

export default Dashboard