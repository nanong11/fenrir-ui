import React, { useState, useEffect, useMemo } from 'react'
import ChannelsStyled from './channels.styles'
import { useDispatch, useSelector } from 'react-redux'
import { Typography, theme, Input, Layout, Button, Modal, Form, message, Select, Tooltip, Menu, List, Avatar, Empty } from 'antd'
import { InfoCircleFilled, InfoCircleOutlined, LeftOutlined, ProfileFilled, UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import conversationAction from '@/redux/conversation/actions'
import utilityActions from '@/redux/utility/actions'
import Scrollbars from '@/components/utility/customScrollbar'
import moment from 'moment-timezone';
import MessageCard from '@/components/messages/messageCard'

const {
  createConversation,
  createConversationReset,
  addParticipants,
  addParticipantsReset,
  removeParticipants,
  removeParticipantsReset,
  updateConversation,
  updateConversationReset,
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
      colorTextTertiary,
      colorSuccessTextActive,
    },
  } = theme.useToken();

  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const view = useSelector(state => state.utilityReducer.view)
  const usersData = useSelector(state => state.authReducer.usersData)
  const userId = usersData && usersData.data ? usersData.data._id : null
  const role = usersData?.data?.role
  const socketIo = useSelector(state => state.utilityReducer.socketIo)
  const conversationArray = useSelector(state => state.utilityReducer.conversationArray)

  const createConversationData = useSelector(state => state.conversationReducer.createConversationData)
  const createConversationLoading = useSelector(state => state.conversationReducer.createConversationLoading)
  const createConversationFailed = useSelector(state => state.conversationReducer.createConversationFailed)
  const allUsersArray = useSelector(state => state.utilityReducer.allUsersArray)

  const addParticipantsData = useSelector(state => state.conversationReducer.addParticipantsData)
  const addParticipantsDataLoading = useSelector(state => state.conversationReducer.addParticipantsDataLoading)
  const addParticipantsDataFailed = useSelector(state => state.conversationReducer.addParticipantsDataFailed)

  const removeParticipantsData = useSelector(state => state.conversationReducer.removeParticipantsData)
  const removeParticipantsDataLoading = useSelector(state => state.conversationReducer.removeParticipantsDataLoading)
  const removeParticipantsDataFailed = useSelector(state => state.conversationReducer.removeParticipantsDataFailed)

  const updateConversationData = useSelector(state => state.conversationReducer.updateConversationData)
  const updateConversationLoading = useSelector(state => state.conversationReducer.updateConversationLoading)
  const updateConversationFailed = useSelector(state => state.conversationReducer.updateConversationFailed)
  
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);
  const [optionSiderCollapse, setOptionSiderCollapse] = useState(true);
  const [participantSiderCollapse, setParticipantSiderCollapse] = useState(true);
  const [participantInfoCollapse, setParticipantInfoCollapse] = useState(true);
  const [broken, setBroken] = useState(null)
  const [newPaticipantsArr, setNewPaticipantsArr] = useState(null)
  const [participantInfo, setParticipantInfo] = useState(null)
  const [currentChannelName, setCurrentChannelName] = useState(channelname)
  const [hoverInfoCircle, setHoverInfoCircle] = useState(false)

  const currentChannel = conversationArray.find(conversation => conversation.name === channelname)
  const participants = currentChannel && currentChannel.participants ? currentChannel.participants : []

  const selectUserOption = useMemo(() => {
    const data = []
    if (allUsersArray && allUsersArray.length > 0) {
      for (let i = 0; i < allUsersArray.length; i++) {
        const user = allUsersArray[i];
        const isUserExist = currentChannel?.participants.find(participant => participant._id === user._id)
        if (!isUserExist && user.isActive) {
          data.push({
            value: user._id,
            label: user.name,
          })
        }
      }
    }
    return data
  }, [allUsersArray, currentChannel]);

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

  if (channelname === 'Create Channel') {
    form.resetFields()
  }

  useEffect(() => {
    if (createConversationData && !createConversationLoading && !createConversationFailed) {
      socketIo.emit('join_conversation', createConversationData.data)
      dispatch(setConversationArray([createConversationData.data,...conversationArray]))

      messageApi.open({
        type: 'success',
        content: `${createConversationData.data.name} channel created!`,
      });
      dispatch(createConversationReset())
      setShowModal(false)
    }

    if (createConversationFailed && !createConversationData && !createConversationLoading) {
      messageApi.open({
        type: 'error',
        content: createConversationFailed.message,
      });
      dispatch(createConversationReset())
    }

    if (updateConversationData && !updateConversationLoading && !updateConversationFailed) {
      if (modalTitle === 'Delete Channel') {
        socketIo.emit('deleted_conversation', updateConversationData.data)
        socketIo.emit('leave_conversation', updateConversationData.data)

        const conversationIndex = conversationArray.findIndex(conversation => conversation._id === updateConversationData.data._id)
        if (conversationIndex > -1) {
          conversationArray.splice(conversationIndex, 1);
          dispatch(setConversationArray([...conversationArray]))
        }

        messageApi.open({
          type: 'success',
          content: `${updateConversationData.data.name} channel deleted!`,
        });
        dispatch(updateConversationReset())
        setModalTitle(null)
        setShowModal(false)
      }
    }

    if (!updateConversationData && !updateConversationLoading && updateConversationFailed) {
      messageApi.open({
        type: 'error',
        content: updateConversationFailed.message,
      });
      dispatch(updateConversationReset())
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

      messageApi.open({
        type: 'success',
        content: 'Adding Participants Success!',
      });
      dispatch(addParticipantsReset())
      setNewPaticipantsArr(null)
      setModalTitle(null)
      setShowModal(false)
    }

    if (!addParticipantsData && !addParticipantsDataLoading && addParticipantsDataFailed) {
      messageApi.open({
        type: 'error',
        content: 'Adding Participants Failed!',
      });
      dispatch(addParticipantsReset())
      setShowModal(false)
    }

    if (removeParticipantsData && !removeParticipantsDataLoading && !removeParticipantsDataFailed) {
      socketIo.emit('removed_participant', {
        conversation: removeParticipantsData.data,
        removedPaticipantsArr: [participantInfo._id]
      })

      const conversationIndex = conversationArray.findIndex(conversation => conversation._id === removeParticipantsData.data._id)
      if (conversationIndex > -1) {
        const conversation = conversationArray[conversationIndex];
        if (participantInfo._id === usersData.data._id) {
          conversationArray.splice(conversationIndex, 1);
        } else {
          conversationArray.splice(conversationIndex, 1, {...conversation,...removeParticipantsData.data,});
        }
        
        dispatch(setConversationArray([...conversationArray]))
      }

      messageApi.open({
        type: 'success',
        content: 'Removing Participant Success!',
      });
      dispatch(removeParticipantsReset())
      setParticipantInfoCollapse(true)
      setParticipantSiderCollapse(false)
      setParticipantInfo(null)
      setModalTitle(null)
      setShowModal(false)
    }

    if (!removeParticipantsData && !removeParticipantsDataLoading && removeParticipantsDataFailed) {
      messageApi.open({
        type: 'error',
        content: 'Removing Participants Failed!',
      });
      dispatch(removeParticipantsReset())
      setShowModal(false)
    }

    if (currentChannelName !== channelname) {
      setParticipantInfoCollapse(true)
      setCurrentChannelName(channelname)
    }

    if (!currentChannel) {
      if (!optionSiderCollapse) {
        setOptionSiderCollapse(true)
      }

      if (!participantSiderCollapse) {
        setParticipantSiderCollapse(true)
      }

      if (!participantInfoCollapse) {
        setParticipantInfoCollapse(true)
      }
    }
  }, [
    dispatch,
    createConversationData,
    createConversationLoading,
    createConversationFailed,
    updateConversationData,
    updateConversationLoading,
    updateConversationFailed,
    addParticipantsData,
    addParticipantsDataLoading,
    addParticipantsDataFailed,
    conversationArray,
    messageApi,
    newPaticipantsArr,
    socketIo,
    currentChannelName,
    channelname,
    removeParticipantsData,
    removeParticipantsDataLoading,
    removeParticipantsDataFailed,
    optionSiderCollapse,
    participantSiderCollapse,
    participantInfoCollapse,
    currentChannel,
    participantInfo,
    usersData,
    modalTitle,
  ])

  const handleShowModal = (value) => {
    form.resetFields()
    setModalTitle(value)
    setShowModal(true)
  }

  const handleOnFinish = (value) => {
    if (modalTitle === 'Delete Channel') {
      if (value.channelName === currentChannelName) {
        const conversationData = {
          conversationId: currentChannel._id,
          body: {
            isActive: false,
            deletedBy: userId
          }
        }
        dispatch(updateConversation(conversationData))
      }
    }

    if (modalTitle === 'Add Participant') {
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

    if (modalTitle === 'Remove Participant') {
      const adminArr = currentChannel.participants.filter(e => e.role === 'admin')
      if (adminArr.length === 1 && participantInfo._id === userId) {
        messageApi.open({
          type: 'error',
          content: 'You cannot remove youself if you are the only admin left!',
        });
      } else {
        const removeParticipantsData = {
          conversationId: currentChannel._id,
          body: {
            participants: [participantInfo._id]
          }
        }
        dispatch(removeParticipants(removeParticipantsData))
      }
    }
  }
  
  const handleParticipantsOnClick = () => {
    setParticipantSiderCollapse(!participantSiderCollapse)
    setOptionSiderCollapse(true)
    setParticipantInfoCollapse(true)
    setParticipantInfo(null)
  }

  const handleOptionOnClick = () => {
    setOptionSiderCollapse(!optionSiderCollapse)
    setParticipantSiderCollapse(true)
    setParticipantInfoCollapse(true)
    setParticipantInfo(null)
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

  const handleParticipantsNameOnClick = (value) => {
    setParticipantInfo(value)
    setParticipantInfoCollapse(false)
    setOptionSiderCollapse(true)
    setParticipantSiderCollapse(true)
  }

  const handleCreateChannel = (value) => {
    const newConversationData = {
      name: value.channelName,
      participants: [userId],
      type: 'channel',
      createdBy: userId
    }
    dispatch(createConversation(newConversationData))
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
            <Title className='prevent-select' level={4} style={{margin: 0}}>{currentChannel?.name ? currentChannel?.name : channelname === 'Create Channel' ? channelname : 'Select Channel'}</Title>
            <Link className='link-btn' onClick={handleParticipantsOnClick}>
              {currentChannel?.participants?.length ? `${currentChannel?.participants?.length} participants` : ''}
            </Link>
          </div>

          {
            currentChannel ?
            optionSiderCollapse && !hoverInfoCircle ?
            <InfoCircleOutlined
            style={{fontSize: '1.8rem', color: colorPrimary, cursor: 'pointer'}}
            onClick={handleOptionOnClick}
            onMouseEnter={() => setHoverInfoCircle(true)}
            onMouseLeave={() => setHoverInfoCircle(false)}
            />
            :
            <InfoCircleFilled
            style={{fontSize: '1.8rem', color: colorPrimary, cursor: 'pointer'}}
            onClick={handleOptionOnClick}
            onMouseEnter={() => setHoverInfoCircle(true)}
            onMouseLeave={() => setHoverInfoCircle(false)}
            />
            : null
          }
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
            {
              currentChannel ?
              (!optionSiderCollapse || !participantInfoCollapse || !participantSiderCollapse) && view === 'MOBILE' ?
              ''
              :
              <MessageCard currentChannel={currentChannel} />
              :
              channelname === 'Create Channel' ?
              <div style={{height: '100%', display: 'flex', justifyContent: 'center', padding: '20px'}}>
                <Form
                name='form'
                form={form}
                onFinish={handleCreateChannel}
                size='large'
                style={{width: '300px'}}
                >
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
                </Form>
              </div>
              :
              <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            }
          </Content>

          {/* OPTIONS */}
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
            border: !optionSiderCollapse ? `1px solid ${colorPrimaryBg}` : 'none',
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
                  <Tooltip title='Delete Channel'>
                    <Button danger onClick={() => handleShowModal('Delete Channel')} >
                      Delete
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
                selectedKeys={null}
                style={{
                  background: colorBgContainer,
                  border: 'none'
                }}
                />
              </Scrollbars>
            </div>
          </Sider>
          
          {/* PARTICIPANTS LIST */}
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
            border: !participantSiderCollapse ? `1px solid ${colorPrimaryBg}` : 'none',
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
                        // actions={[
                        //   role === 'admin' ?
                        //   <Link key={index} className='link-btn'><MoreOutlined style={{fontSize: '1.5rem'}} /></Link>
                        //   : null
                        // ]}
                        >
                          <List.Item.Meta
                          avatar={<Avatar style={{fontSize: '1.3rem'}} src={item.profilePic ? item.profilePic : <UserOutlined /> } />}
                          title={<a onClick={() => handleParticipantsNameOnClick(item)}>{item.name}</a>}
                          description={
                            item.isOnline ?
                            <Text className='prevent-select' style={{color: colorSuccessTextActive}}>online</Text>
                            :
                            <Text className='prevent-select' style={{color: colorTextTertiary}}>offline</Text>
                          }
                          style={{alignItems: 'center'}}
                          />
                        </List.Item>
                      )
                    }
                  }}
                  />
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
                        // actions={[
                        //   role === 'admin' ? <Link key={index} className='link-btn'><MoreOutlined style={{fontSize: '1.5rem'}} /></Link> : null
                        // ]}
                        >
                          <List.Item.Meta
                          avatar={<Avatar style={{fontSize: '1.3rem'}} src={item.profilePic ? item.profilePic : <UserOutlined /> } />}
                          title={<a onClick={() => handleParticipantsNameOnClick(item)}>{item.name}</a>}
                          description={
                            item.isOnline ?
                            <Text className='prevent-select' style={{color: colorSuccessTextActive}}>online</Text>
                            :
                            <Text className='prevent-select' style={{color: colorTextTertiary}}>offline</Text>
                          }
                          style={{alignItems: 'center'}}
                          />
                        </List.Item>
                      )
                    }
                  }}
                  />
                </div>
              </Scrollbars>
            </div>
          </Sider>

          {/* PARTICIPANT INFO */}
          <Sider
          trigger={null}
          collapsible
          breakpoint="md"
          collapsedWidth={0}
          width={broken ? '100%' : '350px'}
          collapsed={participantInfoCollapse}
          onBreakpoint={(broken) => {
            setBroken(broken)
          }}
          // onCollapse={(collapsed, type) => {
          //   setCollapse(collapsed)
          // }}
          style={{
            background: colorBgContainer,
            border: !participantInfoCollapse ? `1px solid ${colorPrimaryBg}` : 'none',
            marginTop: '2px',
            height: '100%'
          }}
          >
            <div style={{padding: 10, height: '100%', display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <Scrollbars style={{height: '100%', transition: 'all 0.2s, background 0s'}} >
                <LeftOutlined style={{fontSize: '1.2rem', color: colorPrimary, margin: '0 0 16px 0'}} onClick={handleParticipantsOnClick} />

                <div
                style={{
                  margin: '0 0 16px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: '16px'
                }}
                >
                  <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  >
                    <Avatar style={{fontSize: '1.3rem', margin: '0 0 16px 0'}} src={participantInfo?.profilePic ? participantInfo.profilePic : <UserOutlined /> } />
                    <Title level={5} style={{margin: 0, textAlign: 'center'}}>{participantInfo?.name}</Title>
                    <Text>{participantInfo?.role}</Text>
                  </div>

                  <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: '10px'
                  }}
                  >
                    <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                    >
                      <Text style={{minWidth: '80px'}}>Username:</Text>
                      <Text ellipsis>{participantInfo?.username ? participantInfo.username : ''}</Text>
                    </div>

                    <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                    >
                      <Text style={{minWidth: '80px'}}>Email:</Text>
                      <Text ellipsis>{participantInfo?.email ? participantInfo.email : ''}</Text>
                    </div>

                    <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                    >
                      <Text style={{minWidth: '80px'}}>Added By:</Text>
                      <Text ellipsis>{participantInfo?.addedBy?.name ? participantInfo.addedBy.name : ''}</Text>
                    </div>

                    <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                    >
                      <Text style={{minWidth: '80px'}}>Added On:</Text>
                      <Text ellipsis>{participantInfo?.addedOn ? moment.tz(participantInfo?.addedOn, "Asia/Manila").format('YYYY-MM-DD HH:mm:ss').replace(/,/g, " ") : ''}</Text>
                    </div>

                    <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                    >
                      <Text style={{minWidth: '80px'}}>Staus:</Text>
                      <Text ellipsis>{participantInfo?.isOnline ? 'Online' : 'Offline'}</Text>
                    </div>
                  </div>
                </div>

                {
                  role === 'admin' ?
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }} >
                    <Button danger onClick={() => handleShowModal('Remove Participant')} >Remove</Button>
                  </div>
                  : null
                }
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
            modalTitle === 'Delete Channel' ?
            <>
              <Form.Item style={{textAlign: 'center'}}>
                <Text className='prevent-select' style={{fontSize: '1.1rem'}}>
                  Type <Text style={{fontWeight: '700', fontSize: '1.1rem', fontStyle: 'italic'}}>{currentChannelName}</Text> and confirm to delete.
                </Text>
              </Form.Item>

              <Form.Item
              name='channelName'
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value) {
                      return Promise.reject('Type the channel name!');
                    }

                    if (value !== currentChannelName) {
                      return Promise.reject('Channel name incorrect!');
                    }
      
                    return Promise.resolve();
                  },
                },
              ]}
              >
                <Input style={{fontStyle: 'italic'}} placeholder={currentChannelName} />
              </Form.Item>

              <Form.Item
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '10px 0 0 0'
              }}
              >
                <Button danger htmlType="submit" loading={updateConversationLoading}>
                  Confirm
                </Button>
              </Form.Item>
            </>
            : modalTitle === 'Add Participant' ?
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
            : modalTitle === 'Remove Participant' ?
            <>
              <Form.Item
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '10px 0 0 0'
              }}
              >
                <Text style={{fontSize: '1.1rem'}}>
                  Remove <Text style={{fontWeight: '700', fontSize: '1.1rem', fontStyle: 'italic'}}>{participantInfo?._id === usersData?.data?._id ? 'yourself' : participantInfo?.name}</Text> in <Text style={{fontWeight: '700', fontSize: '1.1rem', fontStyle: 'italic'}}>{currentChannelName}?</Text>
                </Text>
              </Form.Item>

              <Form.Item
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '10px 0 0 0'
              }}
              >
                <Button htmlType="submit" loading={removeParticipantsDataLoading} danger>
                  Confirm
                </Button>
              </Form.Item>
            </>
            : null
          }
        </Form>
      </Modal>
    </ChannelsStyled>
  )
}
