import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const BackButton = ({ className = '', size = 'sm' }) => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  const sizeClasses = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  }

  return (
    <button
      onClick={handleGoBack}
      className={`btn btn-ghost ${sizeClasses[size]} ${className} lg:hidden`}
      title="Go back"
    >
      <ArrowLeft size={16} />
      <span className="ml-1">Back</span>
    </button>
  )
}

export default BackButton
