import React, { useState } from 'react'
import DashboardStyled from './dashboard.styles'
import { Layout, Menu, theme, Typography, Button } from 'antd';
// import { useSelector } from 'react-redux';
import { MenuFoldOutlined, MenuUnfoldOutlined, GroupOutlined, FileSearchOutlined, UsergroupAddOutlined } from '@ant-design/icons';
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
  const [selectedMenu, setSelectedMenu] = useState(null)

  const sideMenuItems = [
    {
      icon: <GroupOutlined />,
      label: `CHANNELS`,
      allowed: 'any',
      children: [{
        label: 'Attendance'
      }].map((item, index) => {
        return {
          key: 'Attendance',
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
  }

  return (
    <DashboardStyled>
      <Layout className='dashboard-main-wrapper'>
        <Sider
        trigger={null}
        collapsible
        breakpoint="sm"
        collapsedWidth={broken && collapse ? '0' : '80px'}
        width={broken ? '100vw' : '200px'}
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
          <div className='logo'>Logo</div>
          <Menu
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
              padding: 0,
              background: colorBgContainer,
            }}
          >
            {
              broken ?
              <Button
              type="text"
              icon={collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapse(!collapse)}
              style={{
                fontSize: '1.5rem',
                width: 64,
                height: '100%',
                background: colorBgContainer,
                color: colorPrimary
              }}
              /> : null
            }
          </Header>
          
          <Content
            style={{
              margin: '10px',
            }}
          >
            <div
              style={{
                padding: 24,
                minHeight: '100%',
                background: colorBgContainer,
              }}
            >
              <Text>{selectedMenu}</Text>
            </div>
          </Content>
        </Layout>
      </Layout>
    </DashboardStyled>
  )
}
