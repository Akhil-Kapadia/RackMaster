import React, {useEffect, useState} from 'react'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export default function App(){
  const [message, setMessage] = useState('Loading...')

  useEffect(()=>{
    fetch('/api/hello/')
      .then(r=>r.json())
      .then(d=>setMessage(d.message))
      .catch(()=>setMessage('Could not reach API'))
  },[])

  return (
    <Container sx={{mt:4}}>
      <Typography variant="h4" gutterBottom>RackMaster</Typography>
      <Typography variant="body1" gutterBottom>{message}</Typography>
      <Button variant="contained" color="primary">Primary Action</Button>
    </Container>
  )
}
