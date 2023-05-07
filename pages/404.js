import React from 'react'
import { useRouter } from 'next/router'
import { Button, Typography } from 'antd'
import { useSelector } from 'react-redux';

const { Title } = Typography;

export default function Error() {
  const router = useRouter();
  const scrollbarUseRef = useSelector(state => state.utilityReducer.scrollbarUseRef)

  const handleGoBackToHome = () => {
    router.push('/')
    scrollbarUseRef?.current?.scrollToTop({ behavior: 'smooth' })
  }
  
  return (
    <div
    style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px',
      gap: '10px',
    }}
    >
      <Title style={{margin: '0px'}} >404</Title>
      <Title style={{margin: '0px'}} >Error</Title>
      <Button onClick={handleGoBackToHome}>RELOAD</Button>
    </div>
  )
}
