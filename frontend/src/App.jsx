import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { lazy, Suspense } from 'react'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy loaded admin components
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AddDeal = lazy(() => import('./components/admin/AddDeal'))
const AddFarmer = lazy(() => import('./components/admin/AddFarmer'))
const AddPayments = lazy(() => import('./components/admin/AddPayments'))
const FarmerPayments = lazy(() => import('./components/admin/FarmerPayments'))
const List = lazy(() => import('./components/admin/List'))
const Dashboard = lazy(() => import('./components/admin/Dashboard'))
const Login = lazy(() => import('./components/admin/Login'))
const ForgotPassword = lazy(() => import('./components/admin/ForgotPassword'))
const ResetPassword = lazy(() => import('./components/admin/ResetPassword'))
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'))
const AllFarmers = lazy(() => import('./components/admin/AllFarmers'))

// Lazy loaded other components
const NotFound = lazy(() => import('./components/NotFound'))
const LandingPage = lazy(() => import('./components/LandingPage'))

// Lazy loaded farmer components
const FarmerLayout = lazy(() => import('./components/farmer/FarmerLayout'))
const FarmerHome = lazy(() => import('./components/farmer/FarmerHome'))
const FarmerProducts = lazy(() => import('./components/farmer/FarmerProducts'))
const FarmerViewPayments = lazy(() => import('./components/farmer/FarmerViewPayments'))

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<LoadingSpinner size="lg" text="Loading landing page..." />}>
            <LandingPage />
          </Suspense>
        } />
        
        {/* Login Route */}
        <Route path="/login" element={
          <Suspense fallback={<LoadingSpinner size="lg" text="Loading login..." />}>
            <Login />
          </Suspense>
        } />
        
        {/* Forgot Password Route */}
        <Route path="/forgot-password" element={
          <Suspense fallback={<LoadingSpinner size="lg" text="Loading forgot password..." />}>
            <ForgotPassword />
          </Suspense>
        } />
        
        {/* Reset Password Route */}
        <Route path="/reset-password/:token" element={
          <Suspense fallback={<LoadingSpinner size="lg" text="Loading reset password..." />}>
            <ResetPassword />
          </Suspense>
        } />
        
        {/* Protected Admin Routes */}
        <Route path="/admin-dashboard" element={
          <Suspense fallback={<LoadingSpinner size="lg" text="Loading admin panel..." />}>
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          </Suspense>
        }>
          <Route index element={
            <Suspense fallback={<LoadingSpinner size="md" text="Loading dashboard..." />}>
              <Dashboard />
            </Suspense>
          } />
          
          <Route path="list" element={
            <Suspense fallback={<LoadingSpinner size="md" text="Loading deals..." />}>
              <List />
            </Suspense>
          } />
          
          <Route path="add-deal" element={
            <Suspense fallback={<LoadingSpinner size="md" text="Loading add deal..." />}>
              <AddDeal />
            </Suspense>
          } />
          
          <Route path="add-farmer" element={
            <Suspense fallback={<LoadingSpinner size="md" text="Loading add farmer..." />}>
              <AddFarmer />
            </Suspense>
          } />
          
          <Route path="add-payments" element={
            <Suspense fallback={<LoadingSpinner size="md" text="Loading add payments..." />}>
              <AddPayments />
            </Suspense>
          } />
          
          <Route path="all-farmers" element={
            <Suspense fallback={<LoadingSpinner size="md" text="Loading farmers..." />}>
              <AllFarmers />
            </Suspense>
          } />
          
          <Route path="farmer-payments/:farmerId" element={
            <Suspense fallback={<LoadingSpinner size="md" text="Loading payments..." />}>
              <FarmerPayments />
            </Suspense>
          } />
        </Route>

        {/* Protected Farmer Routes */}
        <Route path="/farmer-dashboard" element={
          <Suspense fallback={<LoadingSpinner size="lg" text="Loading farmer dashboard..." />}>
            <FarmerLayout />
          </Suspense>
        }>
          <Route index element={
            <Suspense fallback={<LoadingSpinner size="md" text="Loading farmer home..." />}>
              <FarmerHome />
            </Suspense>
          } />
          
          <Route path="products" element={
            <Suspense fallback={<LoadingSpinner size="md" text="Loading products..." />}>
              <FarmerProducts />
            </Suspense>
          } />
          
          <Route path="payments" element={
            <Suspense fallback={<LoadingSpinner size="md" text="Loading payments..." />}>
              <FarmerViewPayments />
            </Suspense>
          } />
        </Route>

        {/* 404 Catch All Route */}
        <Route path="*" element={
          <Suspense fallback={<LoadingSpinner size="lg" text="Loading..." />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
    </Router>
  )
}

export default App