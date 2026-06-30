import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import Layout from './components/Layout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SalonPage from './pages/SalonPage.jsx'
import MenuPage from './pages/MenuPage.jsx'
import CocinaPage from './pages/CocinaPage.jsx'
import ComandasPage from './pages/ComandasPage.jsx'
import ComandaDetallePage from './pages/ComandaDetallePage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/salon" replace />} />
            <Route path="salon" element={<SalonPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="cocina" element={<CocinaPage />} />
            <Route path="comandas" element={<ComandasPage />} />
            <Route path="comandas/:id" element={<ComandaDetallePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
