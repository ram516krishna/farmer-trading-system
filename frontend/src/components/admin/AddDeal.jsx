import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Package, Weight, IndianRupee, ShoppingBag, User, Phone, MapPin, Tag, ChevronDown, ChevronUp, Upload, CheckCircle2, Leaf } from 'lucide-react'
import BackButton from './BackButton'

const DEAL_INITIAL = {
  farmer: '',
  weight: '',
  rate: '',
  bagQuantity: '',
  material: '',
  status: 'pending',
  receipt: null,
}

const FARMER_INITIAL = {
  name: '',
  fatherName: '',
  mobile: '',
  address: '',
}

const MATERIALS = [
  { value: 'makka', label: 'Makka', emoji: '🌽' },
  { value: 'gehu', label: 'Gehu', emoji: '🌾' },
  { value: 'dhan', label: 'Dhan', emoji: '🌿' },
  { value: 'haldi', label: 'Haldi', emoji: '🟡' },
]

/* ─── Tiny reusable field wrapper ─── */
const Field = ({ label, required, hint, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1 text-xs font-semibold text-base-content/60 uppercase tracking-wider">
      {label}
      {required && <span className="text-error">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10px] text-base-content/40">{hint}</p>}
  </div>
)

/* ─── Icon input ─── */
const IconInput = ({ icon: Icon, accent = 'success', ...props }) => {
  const rings = {
    success: 'focus-within:border-success focus-within:ring-success/20',
    warning: 'focus-within:border-warning focus-within:ring-warning/20',
    info: 'focus-within:border-info focus-within:ring-info/20',
  }
  return (
    <label className={`input outline-none  w-full flex items-center gap-2.5 focus-within:ring-2 transition-all ${rings[accent]}`}>
      <Icon size={15} className="text-base-content/35 shrink-0" />
      <input className="grow text-sm bg-transparent outline-none placeholder:text-base-content/25" {...props} />
    </label>
  )
}

/* ─── Step pill ─── */
const StepPill = ({ n, label, color }) => {
  const c = { green: 'bg-success text-success-content', amber: 'bg-warning text-warning-content', blue: 'bg-info text-info-content' }
  return (
    <div className="flex items-center gap-2.5">
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${c[color]}`}>{n}</span>
      <span className="text-sm font-semibold">{label}</span>
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/farmers`, { credentials: 'include' })
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setDealForm(prev => ({ ...prev, receipt: file }))
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
      const formData = new FormData()
      Object.keys(dealForm).forEach(key => {
        if (key !== 'receipt') formData.append(key, dealForm[key])
      })
      if (dealForm.receipt) formData.append('receipt', dealForm.receipt)

      const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
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
    <div className="w-full space-y-3">
      {/* Mobile Back Button */}
      <div className="flex justify-between items-center">
        <BackButton />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Farmer Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <StepPill n="1" label="Select Farmer" color="green" />
            <button
              type="button"
              onClick={() => setShowInlineFarmer(v => !v)}
              className="flex items-center gap-1.5 text-xs font-medium text-info bg-info/10 border border-info/20 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
            >
              {showInlineFarmer ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              {showInlineFarmer ? 'Cancel' : 'New farmer'}
            </button>
          </div>

          <Field label="Farmer" required>
            <select
              name="farmer"
              value={dealForm.farmer}
              onChange={handleDealChange}
              className="select outline-none text-sm focus:border-success focus:ring-2 focus:ring-success/20 focus:outline-none w-full h-12"
              disabled={farmersLoading}
            >
              <option value="">{farmersLoading ? 'Loading...' : 'Choose a farmer...'}</option>
              {farmers.map(f => (
                <option key={f._id} value={f._id}>{f.name} — {f.mobile}</option>
              ))}
            </select>
          </Field>

          {/* Inline new farmer */}
          {showInlineFarmer && (
            <div className="bg-base-50 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-info/80 flex items-center gap-1.5">
                <User size={11} /> New farmer details
              </p>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Full name" required>
                    <IconInput icon={User} accent="info" type="text" name="name" value={farmerForm.name} onChange={handleFarmerChange} placeholder="Full name" />
                  </Field>
                  <Field label="Father's name" required>
                    <IconInput icon={User} accent="info" type="text" name="fatherName" value={farmerForm.fatherName} onChange={handleFarmerChange} placeholder="Father's name" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Mobile" required>
                    <IconInput icon={Phone} accent="info" type="tel" name="mobile" value={farmerForm.mobile} onChange={handleFarmerChange} placeholder="10-digit" maxLength="10" pattern="[0-9]{10}" />
                  </Field>
                  <Field label="Address">
                    <IconInput icon={MapPin} accent="info" type="text" name="address" value={farmerForm.address} onChange={handleFarmerChange} placeholder="Village / town" />
                  </Field>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveFarmer}
                disabled={savingFarmer}
                className="btn btn-info btn-sm w-full"
              >
                {savingFarmer
                  ? <><span className="loading loading-spinner loading-xs" /> Saving...</>
                  : <><CheckCircle2 size={14} /> Save & select farmer</>}
              </button>
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-4">
          <div className="flex items-center">
            <StepPill n="2" label="Product Details" color="amber" />
          </div>

          <div className="space-y-4">
            {/* Material chips */}
            <Field label="Material" required>
              <div className="grid grid-cols-2 gap-3">
                {MATERIALS.map(m => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setDealForm(prev => ({ ...prev, material: m.value }))}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all active:scale-95
                      ${dealForm.material === m.value
                        ? 'border-warning bg-warning/15 text-warning'
                        : 'border-base-200 bg-base-50 text-base-content/60 hover:border-warning/40'}`}
                  >
                    <span className="text-base leading-none">{m.emoji}</span>
                    {m.label}
                    {dealForm.material === m.value && <CheckCircle2 size={13} className="ml-auto shrink-0" />}
                  </button>
                ))}
              </div>
            </Field>

            {/* Weight & Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Weight (kg)">
                <IconInput icon={Weight} accent="warning" type="number" name="weight" value={dealForm.weight} onChange={handleDealChange} placeholder="0.0" step="0.1" min="0" />
              </Field>
              <Field label="Rate (₹/kg)">
                <IconInput icon={IndianRupee} accent="warning" type="number" name="rate" value={dealForm.rate} onChange={handleDealChange} placeholder="0.00" step="0.01" min="0" />
              </Field>
            </div>

            {/* Live total */}
            {total && (
              <div className="flex items-center justify-between bg-success/10 border border-success/20 rounded-xl p-4">
                <span className="text-xs font-semibold text-success/70 uppercase tracking-wider">Estimated Total</span>
                <span className="text-lg font-bold text-success">₹ {total}</span>
              </div>
            )}
          </div>
        </div>

        {/* Packaging & Payment Section */}
        <div className="space-y-4">
          <div className="flex items-center">
            <StepPill n="3" label="Packaging & Payment" color="blue" />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Bag qty">
                <IconInput icon={ShoppingBag} accent="info" type="number" name="bagQuantity" value={dealForm.bagQuantity} onChange={handleDealChange} placeholder="0" min="0" />
              </Field>

              <Field label="Status">
                <select
                  name="status"
                  value={dealForm.status}
                  onChange={handleDealChange}
                  className="select outline-none text-sm focus:border-info focus:ring-2 focus:ring-info/20 focus:outline-none w-full"
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="paid">✅ Paid</option>
                </select>
              </Field>
            </div>

            {/* Receipt upload */}
            <Field label="Receipt" hint="JPG, PNG or PDF · max 5 MB">
              <label className={`flex items-center gap-3 px-4 py-4 border rounded-xl cursor-pointer transition-all active:scale-[0.98]
                ${dealForm.receipt ? 'border-success/40 bg-success/5' : 'border-base-200 hover:border-info/40 bg-base-50'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                  ${dealForm.receipt ? 'bg-success/15 text-success' : 'bg-base-200 text-base-content/40'}`}>
                  <Upload size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${dealForm.receipt ? 'text-success' : 'text-base-content/50'}`}>
                    {dealForm.receipt ? dealForm.receipt.name : 'Tap to upload receipt'}
                  </p>
                </div>
                <input type="file" onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
              </label>
            </Field>
          </div>
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          className="btn btn-success w-full h-13 text-sm font-semibold tracking-wide shadow-lg shadow-success/20 active:scale-[0.98] transition-transform"
          disabled={loading}
        >
          {loading
            ? <><span className="loading loading-spinner loading-sm" /> Adding deal...</>
            : <><Package size={16} /> Add Deal</>}
        </button>

      </form>
    </div>
  )
}

export default AddDeal