import React, { useState, useEffect } from 'react'
import { User, Eye, IndianRupee, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

const AllFarmers = () => {
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [farmerEarnings, setFarmerEarnings] = useState({})
  const [loadingEarnings, setLoadingEarnings] = useState({})
  

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/farmers`, {
          credentials: 'include'
        })
        const data = await response.json()
        if (data.success) {
          setFarmers(data.data)

        }
      } catch (error) {
        console.error('Error fetching farmers:', error)
       
      } finally {
        setLoading(false)
      }
    }

    fetchFarmers()
  }, [])

  const fetchFarmerEarnings = async (farmerId) => {
    if (farmerEarnings[farmerId]) {
      // Already fetched, no need to fetch again
      return
    }

    setLoadingEarnings(prev => ({ ...prev, [farmerId]: true }))
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/farmers/${farmerId}/earnings`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setFarmerEarnings(prev => ({ 
          ...prev, 
          [farmerId]: data.data 
        }))
        toast.success('Earnings fetched successfully')
      } else {
        toast.error('Failed to fetch earnings')
      }
    } catch (error) {
      console.error('Error fetching farmer earnings:', error)
      toast.error('Something went wrong')
    } finally {
      setLoadingEarnings(prev => ({ ...prev, [farmerId]: false }))
    }
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

   

      {/* Farmers List */}
      <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-6">
       
        
        {farmers.length === 0 ? (
          <div className="text-center py-8">
            <User size={48} className="text-base-content/30 mx-auto mb-4" />
            <p className="text-base-content/60">No farmers found</p>
            <p className="text-sm text-base-content/40 mt-1">Farmers will appear here once registered</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Earnings</th>
                  <th>Status</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {farmers.map((farmer, index) => (
                  <tr key={farmer._id || index}>
                    <td className="font-medium">{farmer.name}</td>
                    <td>{farmer.mobile}</td>
                  
                    
                    <td>
                      {farmerEarnings[farmer._id] !== undefined ? (
                        <div className="flex items-center gap-1">
                          <IndianRupee size={14} className="text-success" />
                          <span className="font-medium text-success">
                            Rs. {farmerEarnings[farmer._id].toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-base-content/40">Not fetched</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-sm ${
                        farmer.isActive !== false ? 'badge-success' : 'badge-warning'
                      }`}>
                        {farmer.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          className="btn btn-ghost btn-xs text-info"
                          onClick={() => fetchFarmerEarnings(farmer._id)}
                          disabled={loadingEarnings[farmer._id]}
                          title="View Earnings"
                        >
                          {loadingEarnings[farmer._id] ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <Eye size={14} />
                          )}
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
    </div>
  )
}

export default AllFarmers
