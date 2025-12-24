import React, { useEffect, useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1'

export default function Home() {
  const [racks, setRacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/racks/`)
      .then((r) => r.json())
      .then((data) => setRacks(data))
      .catch(() => setRacks([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main style={{ padding: 24 }}>
      <h1>RackMaster</h1>
      <h2>Racks</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {racks.map((r) => (
            <li key={r.id}>{r.name} — {r.serial_number || '—'}</li>
          ))}
        </ul>
      )}
    </main>
  )
}
