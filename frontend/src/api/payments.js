// --- API functions for payments ---

export const createPayment = async (paymentData) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/payments`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(paymentData)
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Failed to create payment')
  }

  return data
}

export const getFarmerPayments = async (farmerId, { page = 1, limit = 10 } = {}) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/payments/farmer/${farmerId}?page=${page}&limit=${limit}`,
    { credentials: 'include' }
  )

  const data = await res.json()
  if (!data.success) throw new Error('Failed to fetch payments')
  return data
}

export const getPaymentById = async (paymentId) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/payments/${paymentId}`,
    { credentials: 'include' }
  )

  const data = await res.json()
  if (!data.success) throw new Error('Failed to fetch payment')
  return data
}

export const deletePayment = async (paymentId) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/payments/${paymentId}`,
    {
      method: 'DELETE',
      credentials: 'include'
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete payment')
  }

  return data
}
