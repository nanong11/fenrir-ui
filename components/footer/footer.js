import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import FooterStyled from './footer.styles'
import { Typography } from 'antd';

const { Text } = Typography;

export default function Footer() {
  const view = useSelector(state => state.utilityReducer.view)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    
  }, [

  ])
    
  return (
    <FooterStyled>
      {
        view === 'MOBILE' ? 
        <div className='footer-mobile-wrapper'>
          <Text>&copy; {currentYear} NanongTech. All rights reserved.</Text>
        </div>
        :
        <div className='footer-desktop-wrapper'>
          <Text>&copy; {currentYear} NanongTech. All rights reserved.</Text>
        </div>
      }
    </FooterStyled>
  )
}