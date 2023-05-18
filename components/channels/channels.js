import React from 'react'
import ChannelsStyled from './channels.styles'
import { useSelector } from 'react-redux'
import { Typography, theme, Input, Layout, Space, Button } from 'antd'
import { PlusOutlined, SendOutlined, UserAddOutlined } from '@ant-design/icons';
import Scrollbars from '@/components/utility/customScrollbar';

const { Title, Text, Link } = Typography;
const { Search } = Input;
const { Header, Content, Sider } = Layout;

export default function Channels(props) {
  const { channelname } = props;
  console.log('channelname', channelname)

  const {
    token: { colorBgContainer, colorPrimaryBg, colorPrimary },
  } = theme.useToken();

  const conversationArray = useSelector(state => state.utilityReducer.conversationArray)
  console.log('conversationArray', conversationArray)

  const currentChannel = conversationArray.find(conversation => conversation.name === channelname)
  console.log('currentChannel', currentChannel)
  

  return (
    <ChannelsStyled
    colorprimary={colorPrimary}
    colorprimarybg={colorPrimaryBg}
    >
      <Layout className='channels-desktop-wrapper'>
        <Header
        style={{
          height: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: colorBgContainer,
          rowGap: '10px',
          padding: '8px 16px',
        }}
        >
          <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
          >
            <Title level={3} style={{margin: 0}}>{channelname}</Title>
            <Link style={{color: colorPrimary}}>{currentChannel?.participants?.length} participants</Link>
          </div>

          <div style={{display: 'flex', columnGap: '10px'}}>
            <Button>
              <UserAddOutlined />
            </Button>
            <Button>
              Create Channel
            </Button>
          </div>
          {/* <div className='channels-search-input'>
            <Search
            id='searchInput'
            placeholder="Search"
            // onSearch={handleOnSearchInput}
            // value={searchValue}
            // onChange={(e) => handleOnChangeSearchInput(e.target.value)}
            enterButton
            />
          </div> */}
        </Header>

        <Content
        style={{
          marginTop: '2px',
          background: colorBgContainer,
        }}
        >

        </Content>
      </Layout>
    </ChannelsStyled>
  )
}
