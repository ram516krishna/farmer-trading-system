import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import ViewModal from './ViewModal'
import DeleteModal from './DeleteModal'
import EditDealModal from './EditDealModal'

const List = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedproduct, setSelectedproduct] = useState(null)
  const [activeModal, setActiveModal] = useState(null) // 'view' | 'delete' | 'edit'

  const fetchproducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`,{
        credentials: "include"
      })
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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${id}`,
        { method: 'DELETE', credentials: "include" }
      )
      const data = await response.json()
      if (data.success) {
        setProducts((prev) => prev.filter((f) => f._id !== id))
        toast.success('product deleted successfully')
      } else {
        toast.error('Failed to delete product')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    }
  }

  const handleSave = () => {
    fetchproducts();
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
              <th>Actions</th>
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
                <td>
                  <div className="flex items-center gap-1">
                    <button
                      className="btn btn-ghost btn-xs text-info"
                      onClick={() => openModal('view', product)}
                      title="View"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="btn btn-ghost btn-xs text-success"
                      onClick={() => openModal('edit', product)}
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="btn btn-ghost btn-xs text-error"
                      onClick={() => openModal('delete', product)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ViewModal
        product={activeModal === 'view' ? selectedproduct : null}
        onClose={closeModal}
      />
      <DeleteModal
        product={activeModal === 'delete' ? selectedproduct : null}
        onConfirm={handleDelete}
        onClose={closeModal}
      />
      <EditDealModal
        product={activeModal === 'edit' ? selectedproduct : null}
        onSave={handleSave}
        onClose={closeModal}
      />
    </div>
  )
}

export default List