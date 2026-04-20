// --- API functions ---
export const fetchFarmers = async ({ page, limit }) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/farmers?page=${page}&limit=${limit}`,
    { credentials: 'include' }
  )
  const data = await res.json()
  if (!data.success) throw new Error('Failed to fetch farmers')
  return data
}

export const fetchEarnings = async (farmerId) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/farmers/${farmerId}/earnings`,
    { credentials: 'include' }
  )
  const data = await res.json()
  if (!data.success) throw new Error('Failed to fetch earnings')
  return data.data
}
