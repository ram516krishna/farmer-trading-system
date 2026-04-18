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
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-sm bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-sm">

        {/* Header banner */}
        <div className={`${loginType === 'admin' ? 'bg-success/10' : 'bg-info/10'} px-8 py-7 text-center border-b border-base-300`}>
          <div className={`w-13 h-13 rounded-full ${loginType === 'admin' ? 'bg-success/20 border-success/30' : 'bg-info/20 border-info/30'} border flex items-center justify-center mx-auto mb-3`}>
            {loginType === 'admin' ? <Home size={22} className={loginType === 'admin' ? 'text-success' : 'text-info'} /> : <User size={22} className="text-info" />}
          </div>
          <h1 className="text-lg font-semibold">
            Farmer Trading System
          </h1>
          <p className="text-xs text-base-content/50 mt-1">
            {loginType === 'admin' ? 'Admin portal - sign in to continue' : 'Farmer portal - enter your mobile number'}
          </p>
        </div>

        {/* Login Type Toggle */}
        <div className="px-7 py-4 border-b border-base-300">
          <div className="flex bg-base-200 rounded-lg p-1">
            <button
              type="button"
              onClick={() => handleLoginTypeChange('admin')}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                loginType === 'admin' 
                  ? 'bg-base-100 text-base-content shadow-sm' 
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Admin Login
            </button>
            <button
              type="button"
              onClick={() => handleLoginTypeChange('farmer')}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                loginType === 'farmer' 
                  ? 'bg-base-100 text-base-content shadow-sm' 
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Farmer Login
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">

          {loginType === 'admin' ? (
            <>
              {/* Email */}
              <div className="form-control">
                <label className="label py-0 mb-1.5">
                  <span className="label-text text-xs font-medium tracking-wide">
                    Email address
                  </span>
                </label>
                <label className="input outline-none flex items-center gap-2 focus-within:border-success focus-within:ring-2 focus-within:ring-success/20">
                  <Mail size={14} className="text-base-content/40 shrink-0" />
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
                <label className="label py-0 mb-1.5">
                  <span className="label-text text-xs font-medium tracking-wide">
                    Password
                  </span>
                </label>
                <label className="input outline-none flex items-center gap-2 focus-within:border-success focus-within:ring-2 focus-within:ring-success/20">
                  <Lock size={14} className="text-base-content/40 shrink-0" />
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
                    className="text-base-content/40 hover:text-base-content/70 transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </label>
              </div>
            </>
          ) : (
            /* Farmer Login - Mobile Number Only */
            <div className="form-control">
              <label className="label py-0 mb-1.5">
                <span className="label-text text-xs font-medium tracking-wide">
                  Mobile Number
                </span>
              </label>
              <label className="input outline-none flex items-center gap-2 focus-within:border-info focus-within:ring-2 focus-within:ring-info/20">
                <Phone size={14} className="text-base-content/40 shrink-0" />
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
            className={`btn ${loginType === 'admin' ? 'btn-success' : 'btn-info'} w-full mt-2 text-sm font-medium tracking-wide`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-xs" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>

         
        </form>
      </div>
    </div>
  )
}

export default Login