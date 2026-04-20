// --- API functions ---
export const fetchProducts = async ({ page, limit }) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/products?page=${page}&limit=${limit}`,
    { credentials: 'include' }
  )
  const data = await res.json()
  if (!data.success) throw new Error('Failed to fetch products')
  return data // { data: [...], pagination: {...} }
}

export const deleteProduct = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  const data = await res.json()
  if (!data.success) throw new Error('Failed to delete product')
  return id
}
