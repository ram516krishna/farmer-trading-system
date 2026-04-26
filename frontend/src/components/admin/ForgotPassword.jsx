import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setEmailSent(true)
        toast.success('Password reset link sent to your email')
      } else {
        toast.error(data.message || 'Failed to send reset link')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  const handleResetEmail = () => {
    setEmailSent(false)
    setEmail('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-4">
      <div className="w-full max-w-md bg-base-100 rounded-3xl border border-base-300/50 shadow-xl backdrop-blur-sm overflow-hidden">

        {/* Header banner */}
        <div className="bg-gradient-to-r from-warning/10 to-warning/5 px-8 py-8 text-center border-b border-base-300/50">
          <div className="w-16 h-16 rounded-2xl bg-warning/20 border-warning/30 border flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Mail size={28} className="text-warning" />
          </div>
          <h1 className="text-xl font-bold text-base-content">
            Forgot Password
          </h1>
          <p className="text-sm text-base-content/60 mt-2">
            {emailSent 
              ? 'Check your email for reset link' 
              : 'Enter your email to reset password'
            }
          </p>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6">
          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="form-control">
                <label className="label py-0 mb-2">
                  <span className="label-text text-sm font-medium">
                    Email address
                  </span>
                </label>
                <label className="input outline-none flex items-center gap-3 focus-within:border-warning focus-within:ring-2 focus-within:ring-warning/20 h-12 px-4 w-full">
                  <Mail size={16} className="text-base-content/40 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="grow text-sm bg-transparent outline-none"
                    required
                  />
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
                    Sending reset link...
                  </>
                ) : (
                  <>
                    <Mail size={16} />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              {/* Success Message */}
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-success" />
                </div>
                <h3 className="text-lg font-semibold text-base-content mb-2">
                  Email Sent Successfully!
                </h3>
                <p className="text-sm text-base-content/60 mb-4">
                  We've sent a password reset link to:
                </p>
                <div className="bg-base-200/50 rounded-lg px-4 py-2 mb-4">
                  <p className="text-sm font-medium text-base-content">{email}</p>
                </div>
                <p className="text-xs text-base-content/50">
                  Please check your email and click the link to reset your password. 
                  The link will expire in 10 minutes.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleResetEmail}
                  className="btn btn-outline btn-warning w-full h-10 text-sm font-medium"
                >
                  <Mail size={14} />
                  Send to different email
                </button>
                
                <button
                  onClick={handleBackToLogin}
                  className="btn btn-ghost w-full h-10 text-sm text-base-content/60 hover:text-base-content hover:bg-base-200 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Login
                </button>
              </div>
            </div>
          )}

          {!emailSent && (
            <button
              type="button"
              onClick={handleBackToLogin}
              className="btn btn-ghost w-full h-10 text-sm text-base-content/60 hover:text-base-content hover:bg-base-200 transition-colors mt-4"
            >
              <ArrowLeft size={14} />
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
