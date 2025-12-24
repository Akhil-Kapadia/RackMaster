import * as React from 'react'
import Head from 'next/head'
import { CssBaseline } from '@mui/material'

export default function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) jssStyles.parentElement.removeChild(jssStyles)
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>RackMaster</title>
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </>
  )
}
