import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import toast from 'react-hot-toast'
import { Eye, Pencil, Trash2, Download } from 'lucide-react'
import ViewModal from './ViewModal'
import DeleteModal from './DeleteModal'
import EditDealModal from './EditDealModal'
import { deleteProduct, fetchProducts } from '../../api/products'

const columnHelper = createColumnHelper()
const LIMIT = 10


// --- Component ---
const List = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [activeModal, setActiveModal] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['products', page],
    queryFn: () => fetchProducts({ page, limit: LIMIT }),
    keepPreviousData: true,
  })

  const products = data?.data ?? []
  const pagination = data?.pagination

  const openModal = (type, product) => {
    setSelectedProduct(product)
    setActiveModal(type)
  }

  const closeModal = () => {
    setSelectedProduct(null)
    setActiveModal(null)
  }

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id)
      queryClient.setQueryData(['products', page], (prev) => ({
        ...prev,
        data: prev.data.filter((p) => p._id !== id),
      }))
      toast.success('Product deleted successfully')
    } catch {
      toast.error('Something went wrong')
    }
  }

  const handleSave = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  const columns = [
    columnHelper.accessor('farmer.name', {
      header: 'Name',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('farmer.fatherName', { header: 'Father Name' }),
    columnHelper.accessor('farmer.mobile', { header: 'Mobile' }),
    columnHelper.accessor('weight', {
      header: 'Weight (kg)',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('rate', {
      header: 'Rate (₹/kg)',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('bagQuantity', {
      header: 'Bags',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('material', {
      header: 'Material',
      cell: (info) => (
        <span className="badge badge-ghost badge-sm">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span className={`badge badge-sm ${info.getValue() === 'paid' ? 'badge-success' : 'badge-warning'}`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('receipt', {
      header: 'Receipt',
      cell: (info) => {
        const receipt = info.getValue()
        if (receipt?.url) {
          return (
            <a
              href={receipt.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-xs text-info hover:text-info/80"
              title="View receipt"
            >
              <Download size={14} />
            </a>
          )
        }
        return <span className="text-base-content/30">-</span>
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button className="btn btn-ghost btn-xs text-info" onClick={() => openModal('view', row.original)}><Eye size={14} /></button>
          <button className="btn btn-ghost btn-xs text-success" onClick={() => openModal('edit', row.original)}><Pencil size={14} /></button>
          <button className="btn btn-ghost btn-xs text-error" onClick={() => openModal('delete', row.original)}><Trash2 size={14} /></button>
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <table className="table table-zebra w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex items-center justify-between px-1">
          <span className="text-sm text-base-content/60">
            Page {pagination.page} of {pagination.totalPages} — {pagination.total} products
          </span>
          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={!pagination.hasPrevPage}
            >
              «
            </button>
            <button className="join-item btn btn-sm btn-active">
              {pagination.page}
            </button>
            <button
              className="join-item btn btn-sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.hasNextPage}
            >
              »
            </button>
          </div>
        </div>
      )}

      <ViewModal product={activeModal === 'view' ? selectedProduct : null} onClose={closeModal} />
      <DeleteModal 
        isOpen={activeModal === 'delete'}
        item={selectedProduct}
        title="Delete Deal?"
        message={`This will permanently remove ${selectedProduct?.material || 'this deal'} and all associated records. This action cannot be undone.`}
        confirmText="Delete Deal"
        onConfirm={handleDelete}
        onClose={closeModal}
      />
      <EditDealModal product={activeModal === 'edit' ? selectedProduct : null} onSave={handleSave} onClose={closeModal} />
    </div>
  )
}

export default List