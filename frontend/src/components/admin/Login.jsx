import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff, Home, Phone, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

const Login = () => {
  const navigate = useNavigate()
  const [loginType, setLoginType] = useState('admin') // 'admin' or 'farmer'
  const [formData, setFormData] = useState({ email: '', password: '', mobile: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAdmin } = useAdmin()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let endpoint, payload, successMessage
      
      if (loginType === 'admin') {
        endpoint = `${import.meta.env.VITE_API_URL}/admin/login`
        payload = { email: formData.email, password: formData.password }
        successMessage = 'Admin login successful!'
      } else {
        endpoint = `${import.meta.env.VITE_API_URL}/farmers/login`
        payload = { mobile: formData.mobile }
        successMessage = 'Farmer login successful!'
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(successMessage)
        
        if (loginType === 'admin') {
          setAdmin(data.data)
          navigate('/admin-dashboard')
        } else {
          // Store farmer data in localStorage or context
          localStorage.setItem('farmer', JSON.stringify(data.data))
          // Redirect to farmer dashboard or home
          navigate('/farmer-dashboard')
        }
      } else {
        toast.error(data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ email: '', password: '', mobile: '' })
    setShowPassword(false)
  }

  const handleLoginTypeChange = (type) => {
    setLoginType(type)
    resetForm()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-4">
      <div className="w-full max-w-md bg-base-100 rounded-3xl border border-base-300/50 shadow-xl backdrop-blur-sm overflow-hidden">

        {/* Header banner */}
        <div className={`${loginType === 'admin' ? 'bg-gradient-to-r from-success/10 to-success/5' : 'bg-gradient-to-r from-info/10 to-info/5'} px-8 py-8 text-center border-b border-base-300/50`}>
          <div className={`w-16 h-16 rounded-2xl ${loginType === 'admin' ? 'bg-success/20 border-success/30' : 'bg-info/20 border-info/30'} border flex items-center justify-center mx-auto mb-4 shadow-lg`}>
            {loginType === 'admin' ? <Home size={28} className="text-success" /> : <User size={28} className="text-info" />}
          </div>
          <h1 className="text-xl font-bold text-base-content">
            Farmer Trading System
          </h1>
          <p className="text-sm text-base-content/60 mt-2">
            {loginType === 'admin' ? 'Admin portal - sign in to continue' : 'Farmer portal - enter your mobile number'}
          </p>
        </div>

        {/* Login Type Toggle */}
        <div className="px-8 py-5 border-b border-base-300/50">
          <div className="flex bg-base-200/80 rounded-xl p-1.5 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => handleLoginTypeChange('admin')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                loginType === 'admin' 
                  ? 'bg-base-100 text-base-content shadow-md' 
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Admin Login
            </button>
            <button
              type="button"
              onClick={() => handleLoginTypeChange('farmer')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                loginType === 'farmer' 
                  ? 'bg-base-100 text-base-content shadow-md' 
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Farmer Login
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-5">

          {loginType === 'admin' ? (
            <>
              {/* Email */}
              <div className="form-control">
                <label className="label py-0 mb-2">
                  <span className="label-text text-sm font-medium">
                    Email address
                  </span>
                </label>
                <label className="input outline-none flex items-center gap-3 focus-within:border-success focus-within:ring-2 focus-within:ring-success/20 h-12 px-4 w-full">
                  <Mail size={16} className="text-base-content/40 shrink-0" />
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@mail.com"
                    className="grow text-sm bg-transparent outline-none"
                    required
                  />
                </label>
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label py-0 mb-2">
                  <span className="label-text text-sm font-medium">
                    Password
                  </span>
                </label>
                <label className="input outline-none flex items-center gap-3 focus-within:border-success focus-within:ring-2 focus-within:ring-success/20 h-12 px-4 w-full">
                  <Lock size={16} className="text-base-content/40 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="grow text-sm bg-transparent outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-base-content/40 hover:text-base-content/70 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </label>
              </div>
            </>
          ) : (
            /* Farmer Login - Mobile Number Only */
            <div className="form-control">
              <label className="label py-0 mb-2">
                <span className="label-text text-sm font-medium">
                  Mobile Number
                </span>
              </label>
              <label className="input outline-none flex items-center gap-3 focus-within:border-info focus-within:ring-2 focus-within:ring-info/20 h-12 px-4 w-full">
                <Phone size={16} className="text-base-content/40 shrink-0" />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter your mobile number"
                  className="grow text-sm bg-transparent outline-none"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              </label>
              <label className="label py-0">
                <span className="label-text-alt text-xs text-base-content/50">
                  Enter your 10-digit mobile number
                </span>
              </label>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className={`btn ${loginType === 'admin' ? 'btn-success' : 'btn-info'} w-full h-12 text-sm font-medium tracking-wide shadow-lg ${loginType === 'admin' ? 'shadow-success/20' : 'shadow-info/20'} active:scale-[0.98] transition-transform`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Signing in...
              </>
            ) : (
              <>
                {loginType === 'admin' ? <Home size={16} /> : <User size={16} />}
                Sign in
              </>
            )}
          </button>

          {/* Back to Home */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-ghost w-full h-10 text-sm text-base-content/60 hover:text-base-content hover:bg-base-200 transition-colors"
          >
            <Home size={14} />
            Back to Home
          </button>

        </form>
      </div>
    </div>
  )
}

export default Login