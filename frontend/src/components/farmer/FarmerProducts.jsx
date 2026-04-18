import React, { useState, useEffect } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'


const FarmerProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const farmer = JSON.parse(localStorage.getItem('farmer'));

  const fetchproducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/farmers/${farmer._id}/products`)
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      } else {
        console.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchproducts()
  }, [])

  const openModal = (type, product) => {
    setSelectedproduct(product)
    setActiveModal(type)
  }

  const closeModal = () => {
    setSelectedproduct(null)
    setActiveModal(null)
  }


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">

      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Father Name</th>
              <th>Mobile</th>
              <th>Product</th>
              <th>Weight (kg)</th>
              <th>Rate (₹/kg)</th>
              <th>Bags</th>
              <th>Material</th>
              <th>Status</th>
             
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id || index}>
                <td className="font-medium">{product.farmer?.name}</td>
                <td>{product.farmer?.fatherName}</td>
                <td>{product.farmer?.mobile}</td>
                <td>{product.productName || '-'}</td>
                <td>{product.weight || '-'}</td>
                <td>{product.rate || '-'}</td>
                <td>{product.bagQuantity || '-'}</td>
                <td>
                  <span className="badge badge-ghost badge-sm">{product.material}</span>
                </td>
                <td>
                  <span
                    className={`badge badge-sm ${
                      product.status === 'paid' ? 'badge-success' : 'badge-warning'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  )
}

export default FarmerProducts