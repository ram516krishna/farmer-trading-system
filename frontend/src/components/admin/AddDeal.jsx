import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Package, Weight, IndianRupee, ShoppingBag, User, Phone, MapPin, Tag, ChevronDown, ChevronUp } from 'lucide-react'

const DEAL_INITIAL = {
  farmer: '',
  productName: '',
  weight: '',
  rate: '',
  bagQuantity: '',
  material: '',
  status: 'pending',
}

const FARMER_INITIAL = {
  name: '',
  fatherName: '',
  mobile: '',
  address: '',
}

const MATERIALS = [
  { value: 'makka', label: 'Makka' },
  { value: 'gehu', label: 'Gehu' },
  { value: 'dhan', label: 'Dhan' },
  { value: 'haldi', label: 'Haldi' },
]

const InputField = ({ icon: Icon, ...props }) => (
  <label className="input outline-none flex items-center gap-2.5 focus-within:border-success focus-within:ring-2 focus-within:ring-success/20 transition-all">
    <Icon size={14} className="text-base-content/40 shrink-0" />
    <input className="grow text-sm bg-transparent outline-none placeholder:text-base-content/30" {...props} />
  </label>
)

const SectionHeader = ({ step, color, title, subtitle, children }) => {
  const colors = {
    green: 'bg-success/15 text-success border-success/25',
    amber: 'bg-warning/15 text-warning border-warning/25',
    blue: 'bg-info/15 text-info border-info/25',
  }
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-base-200 border-b border-base-300">
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-semibold ${colors[color]}`}>
          {step}
        </div>
        <div className="leading-tight">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-base-content/50">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

const AddDeal = () => {
  const [dealForm, setDealForm] = useState(DEAL_INITIAL)
  const [farmerForm, setFarmerForm] = useState(FARMER_INITIAL)
  const [farmers, setFarmers] = useState([])
  const [showInlineFarmer, setShowInlineFarmer] = useState(false)
  const [savingFarmer, setSavingFarmer] = useState(false)
  const [farmersLoading, setFarmersLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFarmers = async () => {
      setFarmersLoading(true)
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/farmers`, {
          credentials: 'include',
        })
        const data = await res.json()
        if (data.success) setFarmers(data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setFarmersLoading(false)
      }
    }
    fetchFarmers()
  }, [])

  const handleDealChange = (e) => {
    const { name, value } = e.target
    setDealForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFarmerChange = (e) => {
    const { name, value } = e.target
    setFarmerForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveFarmer = async () => {
    if (!farmerForm.name || !farmerForm.fatherName || !farmerForm.mobile) {
      toast.error('Name, father name and mobile are required')
      return
    }
    setSavingFarmer(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/farmers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(farmerForm),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Farmer added & selected')
        const newFarmer = data.data
        setFarmers(prev => [...prev, newFarmer])
        setDealForm(prev => ({ ...prev, farmer: newFarmer._id }))
        setFarmerForm(FARMER_INITIAL)
        setShowInlineFarmer(false)
      } else {
        toast.error(data.message || 'Failed to add farmer')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    } finally {
      setSavingFarmer(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!dealForm.farmer) {
      toast.error('Please select a farmer')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dealForm),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Deal added successfully')
        setDealForm(DEAL_INITIAL)
      } else {
        toast.error(data.message || 'Failed to add deal')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const total =
    dealForm.weight && dealForm.rate
      ? (parseFloat(dealForm.weight) * parseFloat(dealForm.rate)).toFixed(2)
      : null

  return (
    <div className="w-full  p-6">


      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ── Section 1: Farmer ── */}
        <div className="border border-base-300 rounded-2xl overflow-hidden">
          <SectionHeader step="1" color="green" title="Select farmer" subtitle="Who is this deal for?">
            <button
              type="button"
              onClick={() => setShowInlineFarmer(v => !v)}
              className="flex items-center gap-1.5 text-xs font-medium text-info bg-info/10 border border-info/25 px-3 py-1.5 rounded-lg hover:bg-info/20 transition-colors"
            >
              {showInlineFarmer ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {showInlineFarmer ? 'Cancel' : 'Add new farmer'}
            </button>
          </SectionHeader>

          <div className="p-4 space-y-3">
            <div className="form-control">
              <label className="label py-0 mb-1.5">
                <span className="label-text text-xs font-medium">
                  Farmer <span className="text-error">*</span>
                </span>
              </label>
              <select
                name="farmer"
                value={dealForm.farmer}
                onChange={handleDealChange}
                className="select outline-none text-sm focus:border-success focus:ring-2 focus:ring-success/20 focus:outline-none w-full"
                disabled={farmersLoading}
              >
                <option value="">
                  {farmersLoading ? 'Loading farmers...' : 'Choose from existing farmers...'}
                </option>
                {farmers.map(f => (
                  <option key={f._id} value={f._id}>
                    {f.name} — {f.mobile}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Inline new farmer panel */}
          {showInlineFarmer && (
            <div className="bg-info/5 border-t border-info/20 p-4 space-y-3">
              <p className="text-xs font-medium text-info flex items-center gap-1.5">
                <User size={12} />
                New farmer details
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label py-0 mb-1.5">
                    <span className="label-text text-xs font-medium">
                      Full name <span className="text-error">*</span>
                    </span>
                  </label>
                  <InputField
                    icon={User}
                    type="text"
                    name="name"
                    value={farmerForm.name}
                    onChange={handleFarmerChange}
                    placeholder="Farmer's full name"
                  />
                </div>

                <div className="form-control">
                  <label className="label py-0 mb-1.5">
                    <span className="label-text text-xs font-medium">
                      Father's name <span className="text-error">*</span>
                    </span>
                  </label>
                  <InputField
                    icon={User}
                    type="text"
                    name="fatherName"
                    value={farmerForm.fatherName}
                    onChange={handleFarmerChange}
                    placeholder="Father's name"
                  />
                </div>

                <div className="form-control">
                  <label className="label py-0 mb-1.5">
                    <span className="label-text text-xs font-medium">
                      Mobile <span className="text-error">*</span>
                    </span>
                  </label>
                  <InputField
                    icon={Phone}
                    type="tel"
                    name="mobile"
                    value={farmerForm.mobile}
                    onChange={handleFarmerChange}
                    placeholder="10-digit number"
                    maxLength="10"
                    pattern="[0-9]{10}"
                  />
                </div>

                <div className="form-control">
                  <label className="label py-0 mb-1.5">
                    <span className="label-text text-xs font-medium">Address</span>
                  </label>
                  <InputField
                    icon={MapPin}
                    type="text"
                    name="address"
                    value={farmerForm.address}
                    onChange={handleFarmerChange}
                    placeholder="Village / town (optional)"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveFarmer}
                disabled={savingFarmer}
                className="btn btn-info btn-sm mt-1"
              >
                {savingFarmer ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    Saving...
                  </>
                ) : (
                  'Save & select this farmer'
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── Section 2: Product details ── */}
        <div className="border border-base-300 rounded-2xl overflow-hidden">
          <SectionHeader step="2" color="amber" title="Product details" subtitle="What is being traded?" />

          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label py-0 mb-1.5">
                  <span className="label-text text-xs font-medium">
                    Material <span className="text-error">*</span>
                  </span>
                </label>
                <select
                  name="material"
                  value={dealForm.material}
                  onChange={handleDealChange}
                  className="select outline-none text-sm focus:border-warning focus:ring-2 focus:ring-warning/20 focus:outline-none w-full"
                  required
                >
                  <option value="">Select material type...</option>
                  {MATERIALS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label py-0 mb-1.5">
                  <span className="label-text text-xs font-medium">Product name</span>
                </label>
                <label className="input outline-none flex items-center gap-2.5 focus-within:border-warning focus-within:ring-2 focus-within:ring-warning/20 transition-all">
                  <Tag size={14} className="text-base-content/40 shrink-0" />
                  <input
                    type="text"
                    name="productName"
                    value={dealForm.productName}
                    onChange={handleDealChange}
                    placeholder="e.g. Fine wheat"
                    className="grow text-sm bg-transparent outline-none placeholder:text-base-content/30"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label py-0 mb-1.5">
                  <span className="label-text text-xs font-medium">Weight (kg)</span>
                </label>
                <label className="input outline-none flex items-center gap-2.5 focus-within:border-warning focus-within:ring-2 focus-within:ring-warning/20 transition-all">
                  <Weight size={14} className="text-base-content/40 shrink-0" />
                  <input
                    type="number"
                    name="weight"
                    value={dealForm.weight}
                    onChange={handleDealChange}
                    placeholder="0.0"
                    className="grow text-sm bg-transparent outline-none placeholder:text-base-content/30"
                    step="0.1"
                    min="0"
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label py-0 mb-1.5">
                  <span className="label-text text-xs font-medium">Rate (₹/kg)</span>
                </label>
                <label className="input outline-none flex items-center gap-2.5 focus-within:border-warning focus-within:ring-2 focus-within:ring-warning/20 transition-all">
                  <IndianRupee size={14} className="text-base-content/40 shrink-0" />
                  <input
                    type="number"
                    name="rate"
                    value={dealForm.rate}
                    onChange={handleDealChange}
                    placeholder="0.00"
                    className="grow text-sm bg-transparent outline-none placeholder:text-base-content/30"
                    step="0.01"
                    min="0"
                  />
                </label>
              </div>
            </div>

            {/* Live total */}
            {total && (
              <div className="flex items-center justify-between bg-success/10 border border-success/25 rounded-xl px-4 py-2.5">
                <span className="text-xs font-medium text-success/80">Estimated total</span>
                <span className="text-base font-semibold text-success">₹ {total}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Section 3: Packaging & payment ── */}
        <div className="border border-base-300 rounded-2xl overflow-hidden">
          <SectionHeader step="3" color="blue" title="Packaging & payment" subtitle="Bag count and settlement status" />

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label py-0 mb-1.5">
                  <span className="label-text text-xs font-medium">Bag quantity</span>
                </label>
                <label className="input outline-none flex items-center gap-2.5 focus-within:border-info focus-within:ring-2 focus-within:ring-info/20 transition-all">
                  <ShoppingBag size={14} className="text-base-content/40 shrink-0" />
                  <input
                    type="number"
                    name="bagQuantity"
                    value={dealForm.bagQuantity}
                    onChange={handleDealChange}
                    placeholder="Number of bags"
                    className="grow text-sm bg-transparent outline-none placeholder:text-base-content/30"
                    min="0"
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label py-0 mb-1.5">
                  <span className="label-text text-xs font-medium">Payment status</span>
                </label>
                <select
                  name="status"
                  value={dealForm.status}
                  onChange={handleDealChange}
                  className="select outline-none text-sm focus:border-info focus:ring-2 focus:ring-info/20 focus:outline-none w-full"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-success w-full text-sm font-medium tracking-wide"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-xs" />
              Adding deal...
            </>
          ) : (
            <>
              <Package size={15} />
              Add deal
            </>
          )}
        </button>

      </form>
    </div>
  )
}

export default AddDeal