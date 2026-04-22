import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { Download } from 'lucide-react'
import BackButton from '../admin/BackButton'

const columnHelper = createColumnHelper()
const LIMIT = 10

// --- API function ---
const fetchFarmerProducts = async ({ farmerId, page, limit }) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/farmers/${farmerId}/products?page=${page}&limit=${limit}`
  )
  const data = await res.json()
  if (!data.success) throw new Error('Failed to fetch products')
  return data // { data: [...], pagination: {...} }
}

// --- Component ---
const FarmerProducts = () => {
  const farmer = JSON.parse(localStorage.getItem('farmer'))
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['farmer-products', farmer?._id, page],
    queryFn: () => fetchFarmerProducts({ farmerId: farmer._id, page, limit: LIMIT }),
    enabled: !!farmer?._id,
    keepPreviousData: true,
  })

  const products = data?.data ?? []
  const pagination = data?.pagination

  const columns = [
    columnHelper.accessor('farmer.name', {
      header: 'Name',
      cell: (info) => <span className="font-medium text-nowrap">{info.getValue()}</span>,
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
              title="Download receipt"
            >
              <Download size={14} />
            </a>
          )
        }
        return <span className="text-base-content/30">-</span>
      },
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
      {/* Mobile Back Button */}
      <div className="flex justify-between items-center">
        <BackButton />
      </div>
      
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
    </div>
  )
}

export default FarmerProducts