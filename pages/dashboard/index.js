import React, { useState } from 'react'
import DashboardStyled from './dashboard.styles'
import { Layout, Menu, theme, Typography, Button, Avatar, Space } from 'antd';
// import { useSelector } from 'react-redux';
import { MenuFoldOutlined, MenuUnfoldOutlined, GroupOutlined, FileSearchOutlined, UsergroupAddOutlined, UserOutlined, AntDesignOutlined, ProfileOutlined } from '@ant-design/icons';
// import * as pallete from '@/styles/variables';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

export default function Dashboard() {
  const {
    token: { colorBgContainer, colorPrimaryBg, colorPrimary },
  } = theme.useToken();

  // const view = useSelector(state => state.utilityReducer.view)

  const [collapse, setCollapse] = useState(true)
  const [broken, setBroken] = useState(null)
  const [selectedMenu, setSelectedMenu] = useState('PROFILE')
  const [hideContent, setHideContent] = useState(false)

  const sideMenuItems = [
    {
      key: 'PROFILE',
      icon: <ProfileOutlined />,
      label: `PROFILE`,
      allowed: 'any'
    },
    {
      icon: <GroupOutlined />,
      label: `CHANNELS`,
      allowed: 'any',
      children: [
        {
          key: 'Add Channel',
          label: 'Add Channel',
          allowed: 'admin'
        },
        {
          key: 'Attendance',
          label: 'Attendance',
          allowed: 'any'
        },
      ].map((item, index) => {
        return {
          key: item.key,
          label: item.label
        }
      })
    },
    {
      key: 'FILES',
      icon: <FileSearchOutlined />,
      label: `FILES`,
      allowed: 'any'
    },
    {
      key: 'USERS',
      icon: <UsergroupAddOutlined />,
      label: `USERS`,
      allowed: 'admin',
    },
  ]

  const handleMenuItemOnClick = (value) => {
    setSelectedMenu(value.key)
    setCollapse(!collapse)
    setHideContent(false)
  }

  const handleMenuBtnOnClick = () => {
    setCollapse(!collapse)
    setHideContent(collapse ? true : false)
  }

  return (
    <DashboardStyled>
      <Layout className='dashboard-main-wrapper'>
        <Sider
        trigger={null}
        collapsible
        breakpoint="sm"
        collapsedWidth={broken && collapse ? '0' : '80px'}
        width={broken ? '85vw' : '200px'}
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
            alignItems: 'center',
            justifyContent: 'center',
            width: broken ? '85vw' : '200px',
            height: '64px',
            margin: '0 0 10px 0',
          }}
          >
            <Avatar shape="square" size="large" icon={<UserOutlined />} />
          </Space>
          <Menu
          defaultSelectedKeys={['PROFILE']}
          mode="inline"
          items={sideMenuItems.map(
            (item, index) => ({
              key: item.key,
              icon: item.icon,
              label: item.label,
              children: item.children
            }),
          )}
          onClick={(e) => handleMenuItemOnClick(e)}
          style={{
            background: colorPrimaryBg,
          }}
          />
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

            <Space align='center'>
              <Avatar
                icon={<AntDesignOutlined />}
              />
            </Space>
          </Header>
          
          <Content
            style={{
              margin: '10px',
            }}
          > 
            {
              hideContent ? null :
              <div
              style={{
                padding: 24,
                minHeight: '100%',
                background: colorBgContainer,
              }}
              >
                <Text>{selectedMenu}</Text>
              </div>

            }
          </Content>
        </Layout>
      </Layout>
    </DashboardStyled>
  )
}
