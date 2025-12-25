import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import React, { 
    useState ,
    Suspense
} from 'react';
import { Box, Container, Typography } from '@mui/material'
import DashboardLayout from './pages/dashboardLayout'

// Lazy pages (move to separate files as app grows)
const HomePage = React.lazy(() => Promise.resolve({ default: (props?: { mobileOpen?: boolean; onDrawerToggle?: () => void }) => (
  <Box sx={{ py: 4 }}>
    <Typography variant="h5">Welcome</Typography>
    <Typography variant="body1" sx={{ mt: 1 }}>This is the home page. Start adding pages under <strong>src/pages</strong>.</Typography>
  </Box>
)}))

const DashboardPage = React.lazy(() => Promise.resolve({ default: () => (
  <Box sx={{ py: 4 }}>
    <Typography variant="h5">Dashboard</Typography>
    <Typography variant="body2" sx={{ mt: 1 }}>Place dashboard widgets and live graphs here.</Typography>
  </Box>
)}))

const EntitiesPage = React.lazy(() => Promise.resolve({ default: () => (
  <Box sx={{ py: 4 }}>
    <Typography variant="h5">Entities</Typography>
    <Typography variant="body2" sx={{ mt: 1 }}>List and manage racks, units and devices.</Typography>
  </Box>
)}))

const AddInventoryPage = React.lazy(() => Promise.resolve({ default: () => (
  <Box sx={{ py: 4 }}>
    <Typography variant="h5">Add Inventory</Typography>
    <Typography variant="body2" sx={{ mt: 1 }}>Form to add inventory items.</Typography>
  </Box>
)}))

const ManageInventoryPage = React.lazy(() => Promise.resolve({ default: () => (
  <Box sx={{ py: 4 }}>
    <Typography variant="h5">Manage Inventory</Typography>
    <Typography variant="body2" sx={{ mt: 1 }}>Tools to search and update inventory.</Typography>
  </Box>
)}))

const AnalyticsPage = React.lazy(() => Promise.resolve({ default: () => (
  <Box sx={{ py: 4 }}>
    <Typography variant="h5">Analytics</Typography>
    <Typography variant="body2" sx={{ mt: 1 }}>Charts and reports.</Typography>
  </Box>
)}))

const SettingsPage = React.lazy(() => Promise.resolve({ default: () => (
  <Box sx={{ py: 4 }}>
    <Typography variant="h5">Settings</Typography>
    <Typography variant="body2" sx={{ mt: 1 }}>Application settings and preferences.</Typography>
  </Box>
)}))

const NotFoundPage: React.FC = () => (
  <Box sx={{ py: 4 }}>
    <Typography variant="h5">404 — Not Found</Typography>
    <Typography variant="body2" sx={{ mt: 1 }}>The requested page was not found.</Typography>
  </Box>
)

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
