import React, { useState, useEffect } from 'react'
import ChannelsStyled from './channels.styles'
import { useDispatch, useSelector } from 'react-redux'
import { Typography, theme, Input, Layout, Space, Button, Modal, Form, message, Select } from 'antd'
import { PlusOutlined, SendOutlined, UserAddOutlined } from '@ant-design/icons';
import conversationAction from '@/redux/conversation/actions'
import utilityActions from '@/redux/utility/actions'

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
    token: { colorBgContainer, colorPrimaryBg, colorPrimary },
  } = theme.useToken();

  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const usersData = useSelector(state => state.authReducer.usersData)
  const userId = usersData && usersData.data ? usersData.data._id : null
  const conversationArray = useSelector(state => state.utilityReducer.conversationArray)
  console.log('conversationArray', conversationArray)

  const createConversationData = useSelector(state => state.conversationReducer.createConversationData)
  const createConversationLoading = useSelector(state => state.conversationReducer.createConversationLoading)
  const createConversationFailed = useSelector(state => state.conversationReducer.createConversationFailed)
  const allUsers = useSelector(state => state.usersReducer.allUsers)
  console.log('allUsers', allUsers)

  const addParticipantsData = useSelector(state => state.conversationReducer.addParticipantsData)
  console.log('addParticipantsData', addParticipantsData)
  const addParticipantsDataLoading = useSelector(state => state.conversationReducer.addParticipantsDataLoading)
  const addParticipantsDataFailed = useSelector(state => state.conversationReducer.addParticipantsDataFailed)

  const currentChannel = conversationArray.find(conversation => conversation.name === channelname)
  console.log('currentChannel', currentChannel)

  const selectUserOption = [];
  if (allUsers && allUsers.data.length > 0) {
    for (let i = 0; i < allUsers.data.length; i++) {
      const user = allUsers.data[i];
      const isUserExist = currentChannel.participants.find(participant => participant.userId === user._id)
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

  useEffect(() => {
    if (createConversationData && !createConversationLoading && !createConversationFailed) {

      dispatch(setConversationArray([createConversationData.data, ...conversationArray]))
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
      const conversationIndex = conversationArray.findIndex(conversation => conversation._id === addParticipantsData.data._id)

      if (conversationIndex > -1) {
        const newConversationArray = [...conversationArray];
        const conversation = newConversationArray[conversationIndex];
        newConversationArray.splice(conversationIndex, 1, {...conversation,...addParticipantsData.data,});

        console.log('newConversationArray', newConversationArray)
        dispatch(setConversationArray(newConversationArray))
      }
      dispatch(addParticipantsReset())
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
  

  return (
    <ChannelsStyled
    colorprimary={colorPrimary}
    colorprimarybg={colorPrimaryBg}
    >
      {contextHolder}
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

          {
            usersData?.data?.role === 'admin' ?
            <div style={{display: 'flex', columnGap: '10px'}}>
              <Button onClick={() => handleShowModal('Add Participant')}>
                <UserAddOutlined />
              </Button>
              <Button onClick={() => handleShowModal('Create Channel')} >
                Create
              </Button>
            </div>
            : null
          }
          
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
