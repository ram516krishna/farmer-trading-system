import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminLayout from './components/admin/AdminLayout'
import AddDeal from './components/admin/AddDeal'
import AddFarmer from './components/admin/AddFarmer'
import List from './components/admin/List'
import Dashboard from './components/admin/Dashboard'
import Login from './components/admin/Login'
import ProtectedRoute from './components/admin/ProtectedRoute'
import { FarmerProvider } from './contexts/FarmerContext'
import FarmerLayout from './components/farmer/FarmerLayout'
import FarmerHome from './components/farmer/FarmerHome'

const App = () => {
  return (
    <FarmerProvider>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
           <Route index element={<Dashboard />} />
            <Route path="list" element={<List />} />
            <Route path="add-deal" element={<AddDeal />} />
            <Route path="add-farmer" element={<AddFarmer />} />
          </Route>

          {/* Protected Farmer Routes */}
          <Route path="/farmer" element={<FarmerLayout />}>
            <Route index element={<FarmerHome />} />
            <Route path="home" element={<FarmerHome />} />
          </Route>
        </Routes>
      </Router>
    </FarmerProvider>
  )
}

export default App