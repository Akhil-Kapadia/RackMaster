import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

// Lazy pages (move to separate files as app grows)
const HomePage = React.lazy(() => Promise.resolve({ default: () => (
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

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            RackMaster
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/entities">Entities</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3 }}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/entities" element={<EntitiesPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </Container>
    </BrowserRouter>
  )
}

export default App
