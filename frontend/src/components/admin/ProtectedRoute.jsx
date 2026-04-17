import { Navigate, useLocation } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdmin()
  const location = useLocation()

  if (loading) {
    return <p>Loading...</p>
  }

  if (!admin) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
