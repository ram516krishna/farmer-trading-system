import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { User, Phone, MapPin } from 'lucide-react'

const INITIAL_STATE = {
  name: '',
  fatherName: '',
  address: '',
  mobile: '',
}

const AddFarmer = () => {
  const [formData, setFormData] = useState(INITIAL_STATE)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/farmers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Farmer added successfully')
        setFormData(INITIAL_STATE)
      } else {
        toast.error(data.message || 'Failed to add farmer')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-success/10 to-info/10 rounded-2xl p-6 mb-6 border border-success/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/20 border border-success/30 flex items-center justify-center">
            <User size={20} className="text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content">Add New Farmer</h2>
            <p className="text-sm text-base-content/60 mt-1">Register a new farmer's personal details in the system</p>
          </div>
        </div>
      </div>

      {/* Form with card styling */}
      <div className=" rounded-2xl border border-base-300 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal Information Section */}
          <div>
            <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wide mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-success rounded-full"></div>
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="form-control">
                <label className="label py-0 mb-2">
                  <span className="label-text text-sm font-medium">
                    Full Name <span className="text-error">*</span>
                  </span>
                </label>
                <label className="input outline-none flex items-center gap-3 focus-within:border-success focus-within:ring-2 focus-within:ring-success/20 transition-all">
                  <User size={16} className="text-base-content/40 shrink-0" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter farmer's full name"
                    className="grow text-sm bg-transparent outline-none placeholder:text-base-content/30"
                    required
                  />
                </label>
              </div>

              {/* Father Name */}
              <div className="form-control">
                <label className="label py-0 mb-2">
                  <span className="label-text text-sm font-medium">
                    Father's Name <span className="text-error">*</span>
                  </span>
                </label>
                <label className="input outline-none flex items-center gap-3 focus-within:border-success focus-within:ring-2 focus-within:ring-success/20  transition-all">
                  <User size={16} className="text-base-content/40 shrink-0" />
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    placeholder="Enter father's name"
                    className="grow text-sm bg-transparent outline-none placeholder:text-base-content/30"
                    required
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wide mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-info rounded-full"></div>
              Contact Information
            </h3>
            
            <div className="space-y-4">
              {/* Mobile */}
              <div className="form-control">
                <label className="label py-0 mb-2">
                  <span className="label-text text-sm font-medium">
                    Mobile Number <span className="text-error">*</span>
                  </span>
                </label>
                <label className="input outline-none flex items-center gap-3 focus-within:border-success focus-within:ring-2 focus-within:ring-success/20  transition-all">
                  <Phone size={16} className="text-base-content/40 shrink-0" />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit mobile number"
                    className="grow text-sm bg-transparent outline-none placeholder:text-base-content/30"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                  />
                </label>
                <label className="label py-0">
                  <span className="label-text-alt text-xs text-base-content/50">
                    Please enter a valid 10-digit mobile number
                  </span>
                </label>
              </div>

              {/* Address */}
              <div className="form-control">
                <label className="label py-0 mb-2">
                  <span className="label-text text-sm font-medium">Address</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-base-content/40 pointer-events-none z-10">
                    <MapPin size={16} />
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter complete address (optional)"
                    rows={3}
                    className="textarea outline-none w-full pl-10 text-sm focus:border-success focus:ring-2 focus:ring-success/20 focus:outline-none resize-none  transition-all placeholder:text-base-content/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-base-200">
            <button
              type="submit"
              className="btn btn-success w-full text-sm font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Adding farmer...
                </>
              ) : (
                <>
                  <User size={16} className="mr-2" />
                  Add Farmer
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddFarmer