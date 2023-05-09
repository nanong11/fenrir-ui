import React from 'react'
import UsersStyled from './users.styles'
import { Typography } from 'antd'

const { Title } = Typography

export default function Users(props) {
  const {
    allUsers
  } = props
  console.log('allUsers', allUsers)

  return (
    <UsersStyled>
      <Title level={3} style={{margin: '0 0 20px 0'}}>USERS</Title>
    </UsersStyled>
  )
}
