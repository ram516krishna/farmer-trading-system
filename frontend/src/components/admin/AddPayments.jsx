import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CreditCard, IndianRupee } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchFarmers } from '../../api/farmers'
import { createPayment } from '../../api/payments'
import BackButton from './BackButton'
import { Link } from 'react-router-dom'

const AddPayments = () => {
  const [selectedFarmer, setSelectedFarmer] = useState('')
  const [advancePayment, setAdvancePayment] = useState('')
  const [remainingPayment, setRemainingPayment] = useState('')
  const [reason, setReason] = useState('')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)


  // Fetch all farmers for dropdown
  const { data: farmersData, isLoading: loadingFarmers } = useQuery({
    queryKey: ['farmers-all'],
    queryFn: () => fetchFarmers({ page: 1, limit: 1000 }),
    keepPreviousData: true,
  })

  const farmers = farmersData?.data ?? []

  const handleFarmerChange = (farmerId) => {
    setSelectedFarmer(farmerId)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedFarmer || !advancePayment || !reason) {
      toast.error('Please fill in all required fields')
      return
    }

    const paid = parseFloat(advancePayment)

    if (paid < 0) {
      toast.error('Advance payment cannot be negative')
      return
    }

    setLoading(true)
    try {
      const newPayment = await createPayment({
        farmerId: selectedFarmer,
        advancePayment: paid,
        reason,
        paymentDate,
        remainingPayment: parseFloat(remainingPayment) || 0,
      })

      toast.success('Payment created successfully')
      clear()
    } catch (error) {
      toast.error(error.message || 'Failed to create payment')
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setSelectedFarmer('')
    setAdvancePayment('')
    setRemainingPayment('')
    setReason('')
    setPaymentDate(new Date().toISOString().split('T')[0])
  }

  return (
    <div className="space-y-4">
      {/* Mobile Back Button */}
      <div className="flex justify-between items-center">
        <BackButton />
      </div>

      {/* Header Card */}
      
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-success/20 text-success rounded-xl p-2.5">
            <CreditCard size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold leading-tight">Add Payment</h2>
            <p className="text-xs text-base-content/50 mt-0.5">Create payment entries for farmers</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Farmer Selection */}
          {
            farmers?.length > 0 ? (
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold text-sm">Farmer <span className="text-error">*</span></span>
                </label>
                <select
                  className="select outline-none w-full text-sm h-12"
                  value={selectedFarmer}
                  onChange={(e) => handleFarmerChange(e.target.value)}
                  required
                >
                  <option value="">Choose a farmer...</option>
                  {loadingFarmers ? (
                    <option disabled>Loading farmers...</option>
                  ) : (
                    farmers.map((farmer) => (
                      <option key={farmer._id} value={farmer._id}>
                        {farmer.name} — {farmer.mobile}
                      </option>
                    ))
                  )}
                </select>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-base-content/60">No farmers found</p>
                <Link to="/admin-dashboard/add-farmer" className="text-xs text-base-content/40 mt-1">Create farmers first to add payments</Link>
              </div>
            )
          }

         <div className="grid md:grid-cols-2 grid-cols-1 gap-4 w-full">
           {/* Amount Row — Total & Paid side by side on mobile */}
         
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-sm">Advance Payment <span className="text-error">*</span></span>
              </label>
              <label className="input outline-none w-full flex items-center gap-1.5 h-12 text-sm">
                <IndianRupee size={14} className="text-base-content/40 shrink-0" />
                <input
                  type="number"
                  placeholder="0.00"
                  className="grow min-w-0 w-full"
                  value={advancePayment}
                  onChange={(e) => setAdvancePayment(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </label>
            </div>

             <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-sm">Remaining Payment</span>
              </label>
              <label className="input outline-none w-full flex items-center gap-1.5 h-12 text-sm">
                <IndianRupee size={14} className="text-base-content/40 shrink-0" />
                <input
                  type="number"
                  placeholder="0.00"
                  className="grow min-w-0 w-full"
                  value={remainingPayment}
                  onChange={(e) => setRemainingPayment(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </label>
            </div>
            
         </div>
        
          {/* Reason */}
          <div className="form-control flex flex-col w-full">
            <label className="label py-1">
              <span className="label-text font-semibold text-sm">Reason <span className="text-error">*</span></span>
            </label>
            <textarea
              className="textarea outline-none text-sm resize-none w-full leading-relaxed"
              placeholder="e.g. Advance payment for wheat harvest..."
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          {/* Payment Date */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-semibold text-sm">Payment Date</span>
            </label>
            <input
              type="date"
              className="input outline-none w-full text-sm h-12"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-1">
           
            <button
              type="submit"
              className="btn btn-success flex-[2] h-11 text-sm"
              disabled={loading || !selectedFarmer}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating...
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  Create Payment
                </>
              )}
            </button>
          </div>
        </form>
      

    </div>
  )
}

export default AddPayments