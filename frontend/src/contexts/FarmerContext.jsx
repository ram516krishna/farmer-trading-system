import React, { createContext, useContext, useState, useEffect } from 'react'

const FarmerContext = createContext()

export const FarmerProvider = ({ children }) => {
  const [farmer, setFarmer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkFarmerAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/farmers/auth-check`, {
          credentials: 'include'
        })
        const data = await response.json()
        if (data.success && data.data) {
          setFarmer(data.data)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkFarmerAuth()
  }, [])

  const login = (farmerData) => {
    setFarmer(farmerData)
  }

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/farmers/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setFarmer(null)
    }
  }

  return (
    <FarmerContext.Provider value={{ farmer, login, logout, loading }}>
      {children}
    </FarmerContext.Provider>
  )
}

export const useFarmer = () => {
  const context = useContext(FarmerContext)
  if (!context) {
    throw new Error('useFarmer must be used within a FarmerProvider')
  }
  return context
}

export default FarmerContext
