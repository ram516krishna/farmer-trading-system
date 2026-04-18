import React from 'react'
import { Home, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center space-y-6 p-8">
        {/* 404 Icon and Number */}
        <div className="relative">
          <div className="text-9xl font-bold text-base-content/20">404</div>
          
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-base-content">
            Page Not Found
          </h1>
          <p className="text-base text-base-content/60 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to safety.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-primary flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary"
          >
            Go to Login
          </button>
        </div>

      </div>
    </div>
  )
}

export default NotFound