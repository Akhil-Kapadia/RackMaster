import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1'

type HelloResponse = { message: string }

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('Loading...')

  useEffect(() => {
    fetch(`${API_BASE}/hello/`)
      .then((r) => r.json() as Promise<HelloResponse>)
      .then((d) => setMessage(d.message))
      .catch(() => setMessage('Could not reach API'))
  }, [])

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        RackMaster
      </Typography>
      <Typography variant="body1" gutterBottom>
        {message}
      </Typography>
      <Button variant="contained" color="primary">
        Primary Action
      </Button>
    </Container>
  )
}

export default App
