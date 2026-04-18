import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminLayout from './components/admin/AdminLayout'
import AddDeal from './components/admin/AddDeal'
import AddFarmer from './components/admin/AddFarmer'
import List from './components/admin/List'
import Dashboard from './components/admin/Dashboard'
import Login from './components/admin/Login'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AllFarmers from './components/admin/AllFarmers'
import NotFound from './components/NotFound'
import LandingPage from './components/LandingPage'

import FarmerLayout from './components/farmer/FarmerLayout'
import FarmerHome from './components/farmer/FarmerHome'
import FarmerProducts from "./components/farmer/FarmerProducts"

const App = () => {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
           <Route index element={<Dashboard />} />
            <Route path="list" element={<List />} />
            <Route path="add-deal" element={<AddDeal />} />
            <Route path="add-farmer" element={<AddFarmer />} />
            <Route path="all-farmers" element={<AllFarmers />} />
          </Route>

          {/* Protected Farmer Routes */}
          <Route path="/farmer-dashboard" element={<FarmerLayout />}>
            <Route index element={<FarmerHome />} />
            <Route path= "products" element={<FarmerProducts/>} />
          </Route>

          {/* 404 Catch All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
   
  )
}

export default App