import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const ResetPassword = () => {
  const navigate = useNavigate()
  const { token } = useParams()
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: formData.newPassword }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setResetSuccess(true)
        toast.success('Password reset successfully!')
      } else {
        toast.error(data.message || 'Failed to reset password')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  
  // Show success state
  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-4">
        <div className="w-full max-w-md bg-base-100 rounded-3xl border border-base-300/50 shadow-xl backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-success/10 to-success/5 px-8 py-8 text-center border-b border-base-300/50">
            <div className="w-16 h-16 rounded-2xl bg-success/20 border-success/30 border flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle size={28} className="text-success" />
            </div>
            <h1 className="text-xl font-bold text-base-content">
              Password Reset Successful!
            </h1>
            <p className="text-sm text-base-content/60 mt-2">
              Your password has been updated successfully
            </p>
          </div>
          <div className="p-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-base-content/60">
                You can now login with your new password.
              </p>
              <button
                onClick={handleBackToLogin}
                className="btn btn-success w-full h-12 text-sm font-medium tracking-wide shadow-lg shadow-success/20 active:scale-[0.98] transition-transform"
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show reset form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-4">
      <div className="w-full max-w-md bg-base-100 rounded-3xl border border-base-300/50 shadow-xl backdrop-blur-sm overflow-hidden">

        {/* Header banner */}
        <div className="bg-gradient-to-r from-warning/10 to-warning/5 px-8 py-8 text-center border-b border-base-300/50">
          <div className="w-16 h-16 rounded-2xl bg-warning/20 border-warning/30 border flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock size={28} className="text-warning" />
          </div>
          <h1 className="text-xl font-bold text-base-content">
            Reset Password
          </h1>
          <p className="text-sm text-base-content/60 mt-2">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-5">
          {/* New Password */}
          <div className="form-control">
            <label className="label py-0 mb-2">
              <span className="label-text text-sm font-medium">
                New Password
              </span>
            </label>
            <label className="input outline-none flex items-center gap-3 focus-within:border-warning focus-within:ring-2 focus-within:ring-warning/20 h-12 px-4 w-full">
              <Lock size={16} className="text-base-content/40 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className="grow text-sm bg-transparent outline-none"
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-base-content/40 hover:text-base-content/70 transition-colors p-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </label>
            <label className="label py-0">
              <span className="label-text-alt text-xs text-base-content/50">
                Must be at least 6 characters long
              </span>
            </label>
          </div>

          {/* Confirm Password */}
          <div className="form-control">
            <label className="label py-0 mb-2">
              <span className="label-text text-sm font-medium">
                Confirm New Password
              </span>
            </label>
            <label className="input outline-none flex items-center gap-3 focus-within:border-warning focus-within:ring-2 focus-within:ring-warning/20 h-12 px-4 w-full">
              <Lock size={16} className="text-base-content/40 shrink-0" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                className="grow text-sm bg-transparent outline-none"
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-base-content/40 hover:text-base-content/70 transition-colors p-1"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-warning w-full h-12 text-sm font-medium tracking-wide shadow-lg shadow-warning/20 active:scale-[0.98] transition-transform"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Resetting Password...
              </>
            ) : (
              <>
                <Lock size={16} />
                Reset Password
              </>
            )}
          </button>

          {/* Back to Login */}
          <button
            type="button"
            onClick={handleBackToLogin}
            className="btn btn-ghost w-full h-10 text-sm text-base-content/60 hover:text-base-content hover:bg-base-200 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
