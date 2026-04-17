
import { AlertTriangle } from 'lucide-react'

const DeleteModal = ({ product, onConfirm, onClose }) => {
  if (!product) return null

  return (
    <dialog id="modal_delete" className="modal modal-open">
      <div className="modal-box max-w-sm">
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <div className="bg-warning/20 text-warning rounded-full p-3">
            <AlertTriangle size={24} />
          </div>
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="text-sm text-base-content/60">
            This will permanently remove{' '}
            <span className="font-semibold text-base-content">{product.productName || 'this product'}</span>{' '}
            and all associated records. This action cannot be undone.
          </p>
        </div>

        <div className="modal-action mt-4 flex gap-2 justify-end">
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-sm btn-error"
            onClick={() => {
              onConfirm(product._id)
              onClose()
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  )
}

export default DeleteModal