import React from 'react'
import ProfileStyled from './profile.styles'
import { Space, Typography } from 'antd'

const { Title } = Typography

export default function Profile(props) {
  const { usersData } = props

  return (
    <ProfileStyled>
      <Title className='prevent-select' level={4} style={{margin: '0 0 20px 0'}}>PROFILE</Title>
      <Space
      direction='vertical'
      >
        <Title level={5} style={{margin: '0 0 10px 0'}}>Name: {usersData?.data?.name}</Title>
        <Title level={5} style={{margin: '0 0 10px 0'}}>Email: {usersData?.data?.email}</Title>
      </Space>
    </ProfileStyled>
  )
}
