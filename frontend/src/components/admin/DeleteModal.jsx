
import { AlertTriangle } from 'lucide-react'

const DeleteModal = ({ 
  isOpen, 
  item, 
  itemName = item?.name || item?.productName || 'this item',
  title = 'Are you sure?',
  message = `This will permanently remove ${itemName} and all associated records. This action cannot be undone.`,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm, 
  onClose,
  icon = AlertTriangle,
  iconColor = 'warning',
  buttonColor = 'error',
  size = 'max-w-sm'
}) => {
  if (!isOpen || !item) return null

  const Icon = icon

  return (
    <dialog id="modal_delete" className="modal modal-open">
      <div className={`modal-box ${size}`}>
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <div className={`bg-${iconColor}/20 text-${iconColor} rounded-full p-3`}>
            <Icon size={24} />
          </div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-base-content/60">
            {message}
          </p>
        </div>

        <div className="modal-action mt-4 flex gap-2 justify-end">
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            {cancelText}
          </button>
          <button
            className={`btn btn-sm btn-${buttonColor}`}
            onClick={() => {
              onConfirm(item._id || item.id)
              onClose()
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  )
}

export default DeleteModal