import React, { useState, useEffect } from 'react'
import ChannelsStyled from './channels.styles'
import { useDispatch, useSelector } from 'react-redux'
import { Typography, theme, Input, Layout, Button, Modal, Form, message, Select, Tooltip, Menu, List, Avatar } from 'antd'
import { InfoCircleFilled, MoreOutlined, ProfileFilled, UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import conversationAction from '@/redux/conversation/actions'
import utilityActions from '@/redux/utility/actions'
import Scrollbars from '@/components/utility/customScrollbar'

const {
  createConversation,
  createConversationReset,
  addParticipants,
  addParticipantsReset,
} = conversationAction

const {
  setConversationArray,
} = utilityActions;

const { Title, Text, Link } = Typography;
const { Search } = Input;
const { Header, Content, Sider } = Layout;

export default function Channels(props) {
  const { channelname } = props;

  const {
    token: {
      colorBgContainer,
      colorPrimaryBg,
      colorPrimary,
      colorPrimaryBgHover,
      borderRadius,
    },
  } = theme.useToken();

  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const usersData = useSelector(state => state.authReducer.usersData)
  const userId = usersData && usersData.data ? usersData.data._id : null
  const role = usersData?.data?.role
  const socketIo = useSelector(state => state.utilityReducer.socketIo)
  const conversationArray = useSelector(state => state.utilityReducer.conversationArray)

  const createConversationData = useSelector(state => state.conversationReducer.createConversationData)
  const createConversationLoading = useSelector(state => state.conversationReducer.createConversationLoading)
  const createConversationFailed = useSelector(state => state.conversationReducer.createConversationFailed)
  const allUsers = useSelector(state => state.usersReducer.allUsers)
  const allUsersArray = useSelector(state => state.utilityReducer.allUsersArray)

  const addParticipantsData = useSelector(state => state.conversationReducer.addParticipantsData)
  const addParticipantsDataLoading = useSelector(state => state.conversationReducer.addParticipantsDataLoading)
  const addParticipantsDataFailed = useSelector(state => state.conversationReducer.addParticipantsDataFailed)

  const currentChannel = conversationArray.find(conversation => conversation.name === channelname)
  const participants = currentChannel && currentChannel.participants ? currentChannel.participants : []

  const selectUserOption = [];
  if (allUsersArray && allUsersArray.length > 0) {
    for (let i = 0; i < allUsersArray.length; i++) {
      const user = allUsersArray[i];
      const isUserExist = currentChannel?.participants.find(participant => participant._id === user._id)
      if (!isUserExist && user.isActive) {
        selectUserOption.push({
          value: user._id,
          label: user.name,
        })
      }
    }
  }

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);
  const [optionSiderCollapse, setOptionSiderCollapse] = useState(true);
  const [participantSiderCollapse, setParticipantSiderCollapse] = useState(true);
  const [broken, setBroken] = useState(null)
  const [newPaticipantsArr, setNewPaticipantsArr] = useState(null)

  const sideMenuItems = [
    {
      key: 'PARTICIPANTS',
      icon: <ProfileFilled />,
      label: `PARTICIPANTS`,
      allowed: 'user'
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

  useEffect(() => {
    if (createConversationData && !createConversationLoading && !createConversationFailed) {
      conversationArray.unshift(createConversationData.data)
      dispatch(setConversationArray([...conversationArray]))
      dispatch(createConversationReset())
      setShowModal(false)
    }

    if (createConversationFailed && !createConversationData && !createConversationLoading) {
      messageApi.open({
        type: 'error',
        content: 'Creating Channel Failed!',
      });
      dispatch(createConversationReset())
    }

    if (addParticipantsData && !addParticipantsDataLoading && !addParticipantsDataFailed) {
      socketIo.emit('added_participant', {
        conversation: addParticipantsData.data,
        newPaticipantsArr
      })

      const conversationIndex = conversationArray.findIndex(conversation => conversation._id === addParticipantsData.data._id)
      if (conversationIndex > -1) {
        const conversation = conversationArray[conversationIndex];
        conversationArray.splice(conversationIndex, 1, {...conversation,...addParticipantsData.data,});

        dispatch(setConversationArray([...conversationArray]))
      }

      dispatch(addParticipantsReset())
      setNewPaticipantsArr(null)
      setShowModal(false)
    }

    if (!addParticipantsData && !addParticipantsDataLoading && addParticipantsDataFailed) {
      messageApi.open({
        type: 'error',
        content: 'Adding Participants Failed!',
      });
      dispatch(addParticipantsReset())
    }
  }, [
    dispatch,
    createConversationData,
    createConversationLoading,
    createConversationFailed,
    addParticipantsData,
    addParticipantsDataLoading,
    addParticipantsDataFailed,
    conversationArray,
    messageApi,
    newPaticipantsArr,
    socketIo,
  ])

  const handleShowModal = (value) => {
    form.resetFields()
    setModalTitle(value)
    setShowModal(true)
  }

  const handleOnFinish = (value) => {
    if (modalTitle === 'Create Channel') {
      console.log('value', value)
      const newConversationData = {
        name: value.channelName,
        participants: [userId],
        type: 'channel',
        createdBy: userId
      }
      dispatch(createConversation(newConversationData))
    }

    if (modalTitle === 'Add Participant') {
      console.log('value', value)
      setNewPaticipantsArr(value.participants)
      const addParticipantsData = {
        conversationId: currentChannel._id,
        body: {
          addedBy: userId,
          participants: value.participants
        }
      }

      dispatch(addParticipants(addParticipantsData))
    }
    
  }
  
  const handleParticipantsOnClick = () => {
    setParticipantSiderCollapse(!participantSiderCollapse)
    setOptionSiderCollapse(true)
  }

  const handleOptionOnClick = () => {
    setOptionSiderCollapse(!optionSiderCollapse)
    setParticipantSiderCollapse(true)
  }

  const handleMenuItemOnClick = (value) => {
    switch (value.keyPath[value.keyPath.length - 1]) {
      case 'PARTICIPANTS':
        handleParticipantsOnClick()
        break;
     
      default:
        break;
    }
  }

  return (
    <ChannelsStyled
    colorprimary={colorPrimary}
    colorprimarybg={colorPrimaryBg}
    colorprimarybghover={colorPrimaryBgHover}
    borderradius={borderRadius}
    >
      {contextHolder}
      <Layout className='channels-desktop-wrapper'>
        <Header
        style={{
          height: 'auto',
          display: 'flex',
          background: colorBgContainer,
          padding: '8px 16px',
          justifyContent: 'space-between'
        }}
        >
          <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '150px'
          }}
          >
            <Title level={3} style={{margin: 0}}>{channelname}</Title>
            <Link className='link-btn' onClick={handleParticipantsOnClick}>{currentChannel?.participants?.length} participants</Link>
          </div>

          <InfoCircleFilled style={{fontSize: '1.8rem', color: colorPrimary, cursor: 'pointer'}} onClick={handleOptionOnClick} />
        </Header>
        
        <Layout
        style={{
          height: '100%'
        }}
        >
          <Content
          style={{
            marginTop: '2px',
            background: colorBgContainer,
            // width: !participantSiderCollapse ? '70%' : '100%',
            height: '100%'
          }}
          >

          </Content>

          <Sider
          trigger={null}
          collapsible
          breakpoint="md"
          collapsedWidth={0}
          width={broken ? '100%' : '350px'}
          collapsed={optionSiderCollapse}
          onBreakpoint={(broken) => {
            setBroken(broken)
          }}
          // onCollapse={(collapsed, type) => {
          //   setCollapse(collapsed)
          // }}
          style={{
            background: colorBgContainer,
            // border: `1px solid ${colorPrimaryBg}`,
            marginTop: '2px',
            height: '100%',
          }}
          >
            <div style={{padding: 10, height: '100%', display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div className='channels-search-input'>
                <Search
                id='searchInput'
                placeholder="Search Channel"
                // onSearch={handleOnSearchInput}
                // value={searchValue}
                // onChange={(e) => handleOnChangeSearchInput(e.target.value)}
                enterButton
                />
              </div>

              {
                role === 'admin' ?
                <div style={{display: 'flex', columnGap: '10px', justifyContent: 'space-between', margin: '0 0 8px 0'}}>
                  <Tooltip title='Add Participant'>
                    <Button tooltip='test' onClick={() => handleShowModal('Add Participant')}>
                    <UsergroupAddOutlined />
                    </Button>
                  </Tooltip>
                  <Tooltip title='Create Channel'>
                    <Button onClick={() => handleShowModal('Create Channel')} >
                      Create
                    </Button>
                  </Tooltip>
                </div>
                : null
              }

              <Scrollbars style={{height: '100%', transition: 'all 0.2s, background 0s'}} >
                <Menu
                mode="inline"
                items={filteredSideMenuItems}
                onClick={(e) => handleMenuItemOnClick(e)}
                style={{
                  background: colorBgContainer,
                  border: 'none'
                }}
                />
              </Scrollbars>
            </div>
          </Sider>

          <Sider
          trigger={null}
          collapsible
          breakpoint="md"
          collapsedWidth={0}
          width={broken ? '100%' : '350px'}
          collapsed={participantSiderCollapse}
          onBreakpoint={(broken) => {
            setBroken(broken)
          }}
          // onCollapse={(collapsed, type) => {
          //   setCollapse(collapsed)
          // }}
          style={{
            background: colorBgContainer,
            // border: `1px solid ${colorPrimaryBg}`,
            marginTop: '2px',
            height: '100%'
          }}
          >
            <div style={{padding: 10, height: '100%', display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div className='channels-search-input'>
                <Search
                id='searchInput'
                placeholder="Search Participants"
                // onSearch={handleOnSearchInput}
                // value={searchValue}
                // onChange={(e) => handleOnChangeSearchInput(e.target.value)}
                enterButton
                />
              </div>
              <Scrollbars style={{height: '100%', transition: 'all 0.2s, background 0s'}} >
                <div>
                  <Title level={5} style={{margin: 0}}>Admins</Title>
                  <List
                  itemLayout="horizontal"
                  dataSource={participants}
                  renderItem={(item, index) => {
                    if (item.role === 'admin') {
                      return (
                        <List.Item
                        key={index}
                        actions={[
                          <Link key={index} className='link-btn'><MoreOutlined style={{fontSize: '1.5rem'}} /></Link>
                        ]}
                        >
                          <List.Item.Meta
                          avatar={<Avatar style={{fontSize: '1.3rem'}} src={item.profilePic ? item.profilePic : <UserOutlined /> } />}
                          title={<a>{item.name}</a>}
                          description={item.isOnline ? 'online' : 'offline'}
                          style={{alignItems: 'center'}}
                          />
                        </List.Item>
                      )
                    }
                  }}
                  >

                  </List>
                </div>

                <div>
                  <Title level={5} style={{margin: 0}}>Paticipants</Title>
                  <List
                  itemLayout="horizontal"
                  dataSource={participants}
                  renderItem={(item, index) => {
                    if (item.role === 'user') {
                      return (
                        <List.Item
                        key={index}
                        actions={[
                          <Link key={index} className='link-btn'><MoreOutlined style={{fontSize: '1.5rem'}} /></Link>
                        ]}
                        >
                          <List.Item.Meta
                          avatar={<Avatar style={{fontSize: '1.3rem'}} src={item.profilePic ? item.profilePic : <UserOutlined /> } />}
                          title={<a>{item.name}</a>}
                          description={item.isOnline ? 'online' : 'offline'}
                          style={{alignItems: 'center'}}
                          />
                        </List.Item>
                      )
                    }
                  }}
                  >

                  </List>
                </div>
              </Scrollbars>
            </div>
          </Sider>
        </Layout>
      </Layout>

      <Modal
      title={modalTitle}
      open={showModal} 
      footer={null} 
      destroyOnClose
      maskClosable={false}
      onCancel={() => setShowModal(false)}
      >
        <Form
        name='form'
        form={form}
        onFinish={handleOnFinish}
        size='large'
        >
          {
            modalTitle === 'Create Channel' ?
            <>
              <Form.Item
              name='channelName'
              rules={[
                { required: true, message: 'Channel name is required!' },
              ]}
              >
                <Input placeholder='Channel name' />
              </Form.Item>

              <Form.Item
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '10px 0 0 0'
              }}
              >
                <Button htmlType="submit" loading={createConversationLoading}>
                  CREATE
                </Button>
              </Form.Item>
            </>
            :
            <>
              <Form.Item
              name='participants'
              rules={[
                { required: true, message: 'Select a user!' },
              ]}
              >
                <Select
                showSearch
                mode="multiple"
                allowClear
                placeholder="Select a user"
                optionFilterProp="children"
                // onChange={handleChange}
                // onSearch={onSearch}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={selectUserOption}
                />
              </Form.Item>

              <Form.Item
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '10px 0 0 0'
              }}
              >
                <Button htmlType="submit" loading={addParticipantsDataLoading}>
                  ADD
                </Button>
              </Form.Item>
            </>
          }
        </Form>
      </Modal>
    </ChannelsStyled>
  )
}
