import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { IndianRupee, Calendar, User, ArrowLeft, CreditCard, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getFarmerPayments, deletePayment } from '../../api/payments'
import DeleteModal from './DeleteModal'

const FarmerPayments = () => {
  const { farmerId } = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [deleteModal, setDeleteModal] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const limit = 10

  // Fetch payments for the specific farmer (includes farmer details in response)
  const { data: paymentsData, isLoading: loadingPayments } = useQuery({
    queryKey: ['farmer-payments', farmerId, page],
    queryFn: () => getFarmerPayments(farmerId, { page, limit }),
    enabled: !!farmerId,
  })

  const payments = paymentsData?.data ?? []
  const pagination = paymentsData?.pagination
  const balance = paymentsData?.balance
  const farmer = paymentsData?.farmer

  // Open delete modal
  const openDeleteModal = (payment) => {
    setDeleteModal(payment)
  }

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModal(null)
  }

  // Handle delete payment
  const handleDeletePayment = async (paymentId) => {
    setDeleting(true)
    try {
      await deletePayment(paymentId)
      toast.success('Payment deleted successfully')
      // Refetch payments
      window.location.reload()
    } catch (error) {
      toast.error(error.message || 'Failed to delete payment')
    } finally {
      setDeleting(false)
    }
  }

  if (!farmerId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-base-content/60">No farmer selected</p>
      </div>
    )
  }

  if (loadingPayments) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (!farmer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-base-content/60 mb-4">Farmer not found</p>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/admin-dashboard/all-farmers')}
          >
            Back to Farmers
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/admin-dashboard/all-farmers')}
            >
              <ArrowLeft size={16} />
              Back
            </button>
           
          </div>
          
          {balance !== undefined && (
            <div className="text-right">
              <p className="text-sm text-base-content/60 mb-1">Current Balance</p>
              <div className="flex items-center gap-1">
                <IndianRupee size={16} className="text-success" />
                <span className="text-xl font-bold text-success">
                  {balance.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payments List */}
      <div >
        <div className="flex items-center gap-3 mb-6">
         
          <div>
            <h3 className="text-lg font-bold">Payment History</h3>
            <p className="text-sm text-base-content/60">
              All payment records for {farmer.name}
            </p>
          </div>
        </div>

        {loadingPayments ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard size={48} className="text-base-content/30 mx-auto mb-4" />
            <p className="text-base-content/60">No payment records found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Total Amount</th>
                    <th>Paid Amount</th>
                    <th>Remaining Balance</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-base-content/40" />
                          <span className="text-sm">
                            {new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <IndianRupee size={14} />
                          <span className="font-medium">
                            {payment.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <IndianRupee size={14} className="text-success" />
                          <span className="font-medium text-success">
                            {payment.paidAmount.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <IndianRupee size={14} className="text-warning" />
                          <span className="font-medium text-warning">
                            {payment.remainingBalance.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="max-w-xs">
                        <div className="truncate" title={payment.reason}>
                          {payment.reason}
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => openDeleteModal(payment)}
                          disabled={deleting}
                          title="Delete payment"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-base-content/60">
                  Page {pagination.page} of {pagination.totalPages} · {pagination.total} payments
                </span>
                <div className="join">
                  <button
                    className="join-item btn btn-sm"
                    onClick={() => setPage(p => p - 1)}
                    disabled={!pagination.hasPrevPage}
                  >
                    «
                  </button>
                  <button className="join-item btn btn-sm">
                    {pagination.page}
                  </button>
                  <button
                    className="join-item btn btn-sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal 
        isOpen={!!deleteModal}
        item={deleteModal}
        title="Delete Payment?"
        message={`This will permanently remove this payment of ${deleteModal?.paidAmount || 'this amount'} and all associated records. This action cannot be undone.`}
        confirmText="Delete Payment"
        onConfirm={handleDeletePayment}
        onClose={closeDeleteModal}
      />
    </div>
  )
}

export default FarmerPayments
