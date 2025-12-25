import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import React, { 
    useState ,
    Suspense
} from 'react';
import { Box, Container, Typography } from '@mui/material'
import DashboardLayout from './pages/dashboardLayout'

// Lazy pages (moved to separate files under src/pages)
const HomePage = React.lazy(() => import('./pages/HomePage'))
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'))
const EntitiesPage = React.lazy(() => import('./pages/EntitiesPage'))
const AddInventoryPage = React.lazy(() => import('./pages/AddInventoryPage'))
const ManageInventoryPage = React.lazy(() => import('./pages/ManageInventoryPage'))
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'))
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'))
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'))

const Loading: React.FC = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
    <CircularProgress />
  </Box>
)

// DashboardLayout has been moved to src/pages/dashboardLayout.tsx

const App: React.FC = () => {
  const [open, setOpen] = useState(true)

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev)
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<DashboardLayout open={open} onDrawerToggle={handleDrawerToggle} />}>
            <Route index element={<Container sx={{ mt: 3 }}><HomePage /></Container>} />
            <Route path="dashboard" element={<Container sx={{ mt: 3 }}><DashboardPage /></Container>} />
            <Route path="entities" element={<Container sx={{ mt: 3 }}><EntitiesPage /></Container>} />
            <Route path="inventory">
              <Route path="add" element={<Container sx={{ mt: 3 }}><AddInventoryPage /></Container>} />
              <Route path="manage" element={<Container sx={{ mt: 3 }}><ManageInventoryPage /></Container>} />
            </Route>
            <Route path="analytics" element={<Container sx={{ mt: 3 }}><AnalyticsPage /></Container>} />
            <Route path="settings" element={<Container sx={{ mt: 3 }}><SettingsPage /></Container>} />
            <Route path="404" element={<Container sx={{ mt: 3 }}><NotFoundPage /></Container>} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
