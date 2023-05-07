import React from 'react'
import Head from 'next/head'
import { LoadingOutlined } from '@ant-design/icons'
// import * as pallete from '@/assets/styles/variables';

export default function LoadingPage() {
  return (
    <>
    <Head>
      <title>Loading...</title>
    </Head>
    <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      width: '100vw',
      height: '100vh',
      fontSize: '2.5rem',
    }}>
      <LoadingOutlined />
    </div>
    </>
  )
}
