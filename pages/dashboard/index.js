import React, { useEffect, useMemo, useRef, useState } from 'react'
import DashboardStyled from './dashboard.styles'
import { Layout, Menu, theme, Typography, Button, Avatar, Space } from 'antd';
// import { useSelector } from 'react-redux';
import { MenuFoldOutlined, MenuUnfoldOutlined, GroupOutlined, FileSearchOutlined, UsergroupAddOutlined, UserOutlined, AntDesignOutlined, ProfileOutlined, PlusOutlined } from '@ant-design/icons';
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

  const createConversationData = useSelector(state => state.conversationReducer.createConversationData)
  const createConversationLoading = useSelector(state => state.conversationReducer.createConversationLoading)
  const createConversationFailed = useSelector(state => state.conversationReducer.createConversationFailed)

  const [collapse, setCollapse] = useState(true)
  const [broken, setBroken] = useState(null)
  const [selectedMenu, setSelectedMenu] = useState(<Profile usersData={usersData} />)
  const [hideContent, setHideContent] = useState(false)
  const [currentMenuName, setCurrentMenuName] = useState('PROFILE')

  conversationArray?.sort((conversA, conversB) => {
    const lastMessageA = conversA.messages[conversA.messages.length - 1]
    const lastMessageB = conversB.messages[conversB.messages.length - 1]

    const lastMessageACreatedAt = moment.tz(lastMessageA?.createdAt, "Asia/Taipei").format()
    const lastMessageBCreatedAt = moment.tz(lastMessageB?.createdAt, "Asia/Taipei").format()

    const lastMessageACreatedAtInMilliseconds = Date.parse(lastMessageACreatedAt)
    const lastMessageBCreatedAtMilliseconds = Date.parse(lastMessageBCreatedAt)

    return lastMessageBCreatedAtMilliseconds - lastMessageACreatedAtInMilliseconds
  })

  const channelsChildren = useMemo(() => {
    if (conversationArray && conversationArray.length > 0) {
      const channelsArr = conversationArray.map((conversation) => {
        return {
          key: conversation.name,
          label: <Text className='prevent-select' >{conversation.name}</Text>,
        }
      })
      
      return [
        ...channelsArr,
        {
          key: 'Create Channel',
          label: <Button type='dashed' size='small' style={{width: '50px'}} ><PlusOutlined /></Button>,
        },
      ]
    }
    
  }, [conversationArray])

  const menuScrollbar = useRef(null)

  useEffect(() => {
    // if (role === 'admin' && !allUsers && !allUsersLoading && !allUsersFailed) {
    //   dispatch(fetchAllUsers())
    // }

    if (createConversationData && !createConversationLoading && !createConversationFailed) {
      setCurrentMenuName(createConversationData.data.name)
      setSelectedMenu(<Channels channelname={createConversationData.data.name} />)
      menuScrollbar?.current?.scrollToTop({ behavior: 'smooth' })
    }
  
  }, [
    // dispatch,
    // role,
    // allUsers,
    // allUsersLoading,
    // allUsersFailed,
    createConversationData,
    createConversationLoading,
    createConversationFailed,
  ])
  
  const sideMenuItems = [
    {
      key: 'PROFILE',
      icon: <ProfileOutlined />,
      label: <Text className='prevent-select'>PROFILE</Text>,
      allowed: 'user'
    },
    {
      key: 'CHANNELS',
      icon: <GroupOutlined />,
      label: <Text className='prevent-select'>CHANNELS</Text>,
      allowed: 'user',
      children: channelsChildren,
    },
    {
      key: 'FILES',
      icon: <FileSearchOutlined />,
      label: <Text className='prevent-select'>FILES</Text>,
      allowed: 'user'
    },
    {
      key: 'USERS',
      icon: <UsergroupAddOutlined />,
      label: <Text className='prevent-select'>USERS</Text>,
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
        setCurrentMenuName('PROFILE')
        setSelectedMenu(<Profile usersData={usersData} />)
        break;

      case 'USERS':
        setCurrentMenuName('USERS')
        setSelectedMenu(<Users />)
        break;

      case 'CHANNELS':
        setCurrentMenuName(value.key)
        setSelectedMenu(<Channels channelname={value.key} />)
        break;

      default:
        setCurrentMenuName(value.key)
        setSelectedMenu(<Profile usersData={usersData} />)
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
              rowGap: '10px',
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
              
              <Scrollbars style={{minHeight: '75vh', width: broken ? '90vw' : '200px', transition: 'all 0.2s, background 0s'}} ref={menuScrollbar}>
                <Menu
                defaultSelectedKeys={['PROFILE']}
                mode="inline"
                items={filteredSideMenuItems}
                onClick={(e) => handleMenuItemOnClick(e)}
                selectedKeys={currentMenuName}
                style={{
                  background: colorPrimaryBg,
                  border: 'none',
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
