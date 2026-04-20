import  { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { User, Eye, IndianRupee } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchEarnings, fetchFarmers } from '../../api/farmers'

const columnHelper = createColumnHelper()


// --- Component ---
const AllFarmers = () => {
  const [page, setPage] = useState(1)
  const [earnings, setEarnings] = useState({})
  const [loadingEarnings, setLoadingEarnings] = useState({})
  const limit = 10

  // TanStack Query — fetch farmers
  const { data, isLoading } = useQuery({
    queryKey: ['farmers', page],
    queryFn: () => fetchFarmers({ page, limit }),
    keepPreviousData: true, // smooth pagination, no flash
  })

  const farmers = data?.data ?? []
  const pagination = data?.pagination

  // Fetch earnings for a single farmer
  const handleFetchEarnings = async (farmerId) => {
    if (earnings[farmerId] !== undefined) return
    setLoadingEarnings(prev => ({ ...prev, [farmerId]: true }))
    try {
      const amount = await fetchEarnings(farmerId)
      setEarnings(prev => ({ ...prev, [farmerId]: amount }))
      toast.success('Earnings fetched')
    } catch {
      toast.error('Failed to fetch earnings')
    } finally {
      setLoadingEarnings(prev => ({ ...prev, [farmerId]: false }))
    }
  }

  // TanStack Table — column definitions
  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('fatherName', {
      header: 'Father Name',
    }),
    columnHelper.accessor('mobile', {
      header: 'Mobile',
    }),
     columnHelper.accessor('address', {
      header: 'Address',
      cell: ({ getValue }) => <div className="line-clamp-2 w-[180px]">{getValue()}</div>
    }),
    columnHelper.display({
      id: 'earnings',
      header: 'Earnings',
      cell: ({ row }) => {
        const farmerId = row.original._id
        const amount = earnings[farmerId]
        return amount !== undefined ? (
          <div className="flex items-center gap-1">
            <IndianRupee size={14} className="text-success" />
            <span className="font-medium text-success">Rs. {amount.toFixed(2)}</span>
          </div>
        ) : (
          <span className="text-base-content/40 text-sm">Not fetched</span>
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'View',
      cell: ({ row }) => {
        const farmerId = row.original._id
        return (
          <button
            className="btn btn-ghost btn-xs text-info"
            onClick={() => handleFetchEarnings(farmerId)}
            disabled={loadingEarnings[farmerId]}
          >
            {loadingEarnings[farmerId]
              ? <span className="loading loading-spinner loading-xs" />
              : <Eye size={14} />}
          </button>
        )
      },
    }),
  ]

  // TanStack Table — table instance
  const table = useReactTable({
    data: farmers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-6">
        {farmers.length === 0 ? (
          <div className="text-center py-8">
            <User size={48} className="text-base-content/30 mx-auto mb-4" />
            <p className="text-base-content/60">No farmers found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-base-content/60">
                  Page {pagination.page} of {pagination.totalPages} — {pagination.total} farmers
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
    </div>
  )
}

export default AllFarmers