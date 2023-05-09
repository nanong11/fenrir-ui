import React from 'react'
import ProfileStyled from './profile.styles'
import { Space, Typography } from 'antd'
import { useSelector } from 'react-redux'

const { Text, Title } = Typography

export default function Profile() {
  const usersData = useSelector(state => state.authReducer.usersData)

  return (
    <ProfileStyled>
      <Title level={3} style={{margin: '0 0 20px 0'}}>PROFILE</Title>
      <Space
      direction='vertical'
      >
        <Title level={5} style={{margin: '0 0 10px 0'}}>Name: {usersData.data.firstName} {usersData.data.lastName}</Title>
        <Title level={5} style={{margin: '0 0 10px 0'}}>Mobile: {usersData.data.moble}</Title>
        <Title level={5} style={{margin: '0 0 10px 0'}}>Email: {usersData.data.email}</Title>
      </Space>
    </ProfileStyled>
  )
}
