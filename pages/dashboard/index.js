import React, { useEffect, useState } from 'react'
import DashboardStyled from './dashboard.styles'
import { Layout, Menu, theme, Typography, Button, Avatar, Space } from 'antd';
// import { useSelector } from 'react-redux';
import { MenuFoldOutlined, MenuUnfoldOutlined, GroupOutlined, FileSearchOutlined, UsergroupAddOutlined, UserOutlined, AntDesignOutlined, ProfileOutlined } from '@ant-design/icons';
// import * as pallete from '@/styles/variables';
import Profile from '@/components/profile/profile';
import authActions from '@/redux/auth/actions'
import { useDispatch, useSelector } from 'react-redux';
import usersAction from '@/redux/users/actions'
import Users from '@/components/users/users';
import Channels from '@/components/channels/channels';
import moment from 'moment-timezone';
import Scrollbars from '@/components/utility/customScrollbar'

const {
  logout,
} = authActions

const {
  fetchAllUsers,
} = usersAction

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

export default function Dashboard() {
  const {
    token: { colorBgContainer, colorPrimaryBg, colorPrimary },
  } = theme.useToken();

  const dispatch = useDispatch()
  // const view = useSelector(state => state.utilityReducer.view)
  const usersData = useSelector(state => state.authReducer.usersData)
  const role = usersData?.data?.role
  // const allUsers = useSelector(state => state.usersReducer.allUsers)
  // console.log('allUsers', allUsers)
  // const allUsersLoading = useSelector(state => state.usersReducer.allUsersLoading)
  // const allUsersFailed = useSelector(state => state.usersReducer.allUsersFailed)
  const conversationArray = useSelector(state => state.utilityReducer.conversationArray)

  const [collapse, setCollapse] = useState(true)
  const [broken, setBroken] = useState(null)
  const [selectedMenu, setSelectedMenu] = useState(<Profile usersData={usersData} />)
  const [hideContent, setHideContent] = useState(false)

  conversationArray?.sort((conversA, conversB) => {
    const lastMessageA = conversA.messages[conversA.messages.length - 1]
    const lastMessageB = conversB.messages[conversB.messages.length - 1]

    const lastMessageACreatedAt = moment.tz(lastMessageA?.createdAt, "Asia/Taipei").format()
    const lastMessageBCreatedAt = moment.tz(lastMessageB?.createdAt, "Asia/Taipei").format()

    const lastMessageACreatedAtInMilliseconds = Date.parse(lastMessageACreatedAt)
    const lastMessageBCreatedAtMilliseconds = Date.parse(lastMessageBCreatedAt)

    return lastMessageBCreatedAtMilliseconds - lastMessageACreatedAtInMilliseconds
  })

  useEffect(() => {
    // if (role === 'admin' && !allUsers && !allUsersLoading && !allUsersFailed) {
    //   dispatch(fetchAllUsers())
    // }
  
  }, [
    // dispatch,
    // role,
    // allUsers,
    // allUsersLoading,
    // allUsersFailed,
  ])
  
  const sideMenuItems = [
    {
      key: 'PROFILE',
      icon: <ProfileOutlined />,
      label: `PROFILE`,
      allowed: 'user'
    },
    {
      key: 'CHANNELS',
      icon: <GroupOutlined />,
      label: `CHANNELS`,
      allowed: 'user',
      children: conversationArray.map((conversation) => {
        return {
          key: conversation.name,
          label: conversation.name,
        }
      })
    },
    {
      key: 'FILES',
      icon: <FileSearchOutlined />,
      label: `FILES`,
      allowed: 'user'
    },
    {
      key: 'USERS',
      icon: <UsergroupAddOutlined />,
      label: `USERS`,
      allowed: 'admin',
    },
  ]

  const filteredSideMenuItems = sideMenuItems.map((item) => {
      if (role === 'admin') {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: item.children
        }
      } else if (role === item.allowed ) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: item.children
        }
      }
  })

  const handleMenuItemOnClick = (value) => {
    // console.log('MENU_VALUE', value)
    setCollapse(!collapse)
    setHideContent(false)

    switch (value.keyPath[value.keyPath.length - 1]) {
      case 'PROFILE':
        setSelectedMenu(<Profile usersData={usersData} />)
        break;

      case 'USERS':
        setSelectedMenu(<Users />)
        break;

      case 'CHANNELS':
        setSelectedMenu(<Channels channelname={value.key} />)
        break;

      default:
        setSelectedMenu(value.key)
        break;
    }
  }

  const handleMenuBtnOnClick = () => {
    setCollapse(!collapse)
    setHideContent(collapse)
  }

  const handleLogoutOnClick = () => {
    dispatch(logout())
  }

  return (
    <DashboardStyled>
      <Layout className='dashboard-main-wrapper'>
        <Sider
        trigger={null}
        collapsible
        breakpoint="md"
        collapsedWidth={broken && collapse ? '0' : '80px'}
        width={broken ? '90vw' : '200px'}
        collapsed={broken ? collapse : false}
        onBreakpoint={(broken) => {
          setBroken(broken)
        }}
        onCollapse={(collapsed, type) => {
          setCollapse(collapsed)
        }}
        style={{
          background: colorPrimaryBg,
        }}
        > 
          <Space
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: broken ? '90vw' : '200px',
            height: '100%',
          }}
          >
            <Space
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: broken ? '90vw' : '200px',
              rowGap: '10px'
            }}
            >
              <Space
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: broken ? '85vw' : '200px',
                height: '64px',
                // margin: '0 0 10px 0',
              }}
              >
                <Avatar shape="square" size="large" icon={<UserOutlined />} />
              </Space>
              
              <Scrollbars style={{minHeight: '75vh', width: broken ? '90vw' : '200px', transition: 'all 0.2s, background 0s'}} >
                <Menu
                defaultSelectedKeys={['PROFILE']}
                mode="inline"
                items={filteredSideMenuItems}
                onClick={(e) => handleMenuItemOnClick(e)}
                style={{
                  background: colorPrimaryBg,
                }}
                />
              </Scrollbars>
            </Space>

            <Space
            style={{ height: '64px'}}
            >
              <Button onClick={handleLogoutOnClick}>LOGOUT</Button>
            </Space>
          </Space>
        </Sider>
              
        <Layout>
          <Header
            style={{
              padding: '0 10px 0 0',
              background: colorBgContainer,
              display: 'flex',
              justifyContent: broken ? 'space-between' : 'flex-end',
              columnGap: '20px'
            }}
          >
            {
              broken ?
              <Button
              type="text"
              icon={collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={handleMenuBtnOnClick}
              style={{
                fontSize: '1.5rem',
                width: 64,
                height: '100%',
                background: colorBgContainer,
                color: colorPrimary
              }}
              /> : null
            }
            
            {
              hideContent ? null :
              <Space align='center'>
                <Avatar
                  icon={<AntDesignOutlined />}
                />
              </Space>
            }
          </Header>
          
          {
            hideContent ? null :
            <Content
              style={{
                margin: '10px',
              }}
            > 
              <div
              style={{
                // padding: 16,
                minHeight: '100%',
                background: colorBgContainer,
              }}
              >
                {selectedMenu}
              </div>
            </Content>
          }
          
        </Layout>
      </Layout>
    </DashboardStyled>
  )
}
