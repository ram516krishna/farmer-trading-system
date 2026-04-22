import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Package, Weight, IndianRupee, ShoppingBag } from 'lucide-react'

const INITIAL_STATE = {
  farmer: '',
  productName: '',
  weight: '',
  rate: '',
  bagQuantity: '',
  material: '',
  status: 'pending',
}

const MATERIALS = [
  { value: 'makka', label: 'Makka' },
  { value: 'gehu', label: 'Gehu' },
  { value: 'dhan', label: 'Dhan' },
  { value: 'haldi', label: 'Haldi' },
]

const EditDealModal = ({ product, onSave, onClose }) => {
  const [form, setForm] = useState({})

  useEffect(() => {
    if (product) {
      // Create form data with nested farmer info
      setForm({
        farmer: product.farmer?._id || '',
        productName: product.productName || '',
        weight: product.weight || '',
        rate: product.rate || '',
        bagQuantity: product.bagQuantity || '',
        material: product.material || '',
        status: product.status || 'pending',
      })
    }
  }, [product])

  if (!product) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${product._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        }
      )
      const data = await response.json()
      if (data.success) {
        toast.success('Deal updated successfully')
        onSave()
        onClose()
      } else {
        toast.error('Failed to update deal')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    }
  }

  return (
    <dialog id="modal_edit" className="modal modal-open">
      <div className="modal-box max-w-lg">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="font-bold text-lg mb-4">Edit Deal</h3>

        <div className="grid grid-cols-1 gap-4">
        
          {/* Deal Details (Editable) */}
          <div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: 'Weight (kg)', name: 'weight', type: 'number' },
                { label: 'Rate (₹/kg)', name: 'rate', type: 'number' },
                { label: 'Bag Quantity', name: 'bagQuantity', type: 'number' },
              ].map(({ label, name, type }) => (
                <div key={name} className="form-control">
                  <label className="label py-0 mb-2">
                    <span className="label-text text-sm font-medium">{label}</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-3 focus-within:border-warning focus-within:ring-2 focus-within:ring-warning/20 bg-base-100/50 transition-all">
                    <Package size={16} className="text-base-content/40 shrink-0" />
                    <input
                      type={type}
                      name={name}
                      value={form[name] || ''}
                      onChange={handleChange}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className="grow text-sm outline-none placeholder:text-base-content/30"
                      step={type === 'number' ? '0.1' : undefined}
                      min="0"
                    />
                  </label>
                </div>
              ))}
              
              {/* Material Select Field */}
              <div className="form-control">
                <label className="label py-0 mb-2">
                  <span className="label-text text-sm font-medium">Material</span>
                </label>
                <select
                  name="material"
                  value={form.material || ''}
                  onChange={handleChange}
                  className="select select-bordered text-sm focus:border-warning focus:ring-2 focus:ring-warning/20 focus:outline-none w-full"
                >
                  <option value="">Select Material</option>
                  {MATERIALS.map((material) => (
                    <option key={material.value} value={material.value}>
                      {material.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <div className="form-control">
              <label className="label py-0 mb-2">
                <span className="label-text text-sm font-medium">Status</span>
              </label>
              <select
                name="status"
                value={form.status || 'pending'}
                onChange={handleChange}
                className="select select-bordered text-sm focus:border-warning focus:ring-2 focus:ring-warning/20 focus:outline-none w-full "
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
        </div>

        <div className="modal-action mt-4">
          <button className="btn btn-sm btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-sm btn-primary" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  )
}

export default EditDealModal
