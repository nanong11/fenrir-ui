import React, { useEffect, useMemo, useRef, useState } from 'react'
import UsersStyled from './users.styles'
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tooltip, Typography, message, theme } from 'antd'
import usersActions from '@/redux/users/actions'
import { useDispatch, useSelector } from 'react-redux'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words';
import utilityActions from '@/redux/utility/actions'

const {
  updateUser,
  updateUserReset,
  signUp,
  signUpReset,
  fetchAllUsers,
} = usersActions

const {
  setUsersTableData,
} = utilityActions;

const { Title, Text } = Typography

const AddUserModal = (props) => {
  const {
    signupLoading,
    showAddUserModal,
    setShowAddUserModal,
    colorPrimaryBg,
    borderRadius,
    addUser,
  } = props

  return (
    <Modal
    title={<Text className='prevent-select'>Add User</Text>}
    open={showAddUserModal} 
    footer={null} 
    closable={false}
    onCancel={() => setShowAddUserModal(false)}
    destroyOnClose
    style={{
      minWidth: '300px',
    }}
    >
      <Form
      name='AddUserModal'
      onFinish={addUser}
      style={{
        padding: '16px',
        background: colorPrimaryBg,
        borderRadius: borderRadius,
        display: 'flex',
        flexDirection: 'column'
      }}
      >
        <Form.Item
        name='username'
        rules={[
          {
            validator: async (_, value) => {
              if (value) {
                const isUserNameValid = /^[a-z0-9_\.]+$/.test(value)
                if (isUserNameValid) {
                  return Promise.resolve();
                }
                
                return Promise.reject('alphanumeric . _ only!');
              }

              return Promise.reject('Please input Username!');
            },
          },
        ]}
        >
          <Input
          placeholder='username'
          disabled={signupLoading}
          maxLength={30}
          />
        </Form.Item>

        <Form.Item
        name='name'
        rules={[
          {
            validator: async (_, value) => {
              if (value) {
                const isNameValid = /^[ñÑA-Za-z\s]*$/.test(value)
                if (isNameValid) {
                  return Promise.resolve();
                }
                
                return Promise.reject('Please input valid name!');
              }

              return Promise.reject('Please input Name!');
            },
          },
        ]}
        >
          <Input
          placeholder='Name'
          disabled={signupLoading}
          maxLength={30}
          />
        </Form.Item>
          
        <Form.Item
        name='email'
        rules={[
          {
            validator: async (_, value) => {
              if (value) {
                const isEmailValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
                if (isEmailValid) {
                  return Promise.resolve();
                }
                
                return Promise.reject('Please input valid email!');
              }

              return Promise.resolve();
            },
          },
        ]}
        >
          <Input
          placeholder='Email'
          disabled={signupLoading}
          />
        </Form.Item>
        
        <Form.Item
        name='role'
        rules={[
          {
            required: true,
            message: 'Please choose a role!'
          },
        ]}
        >
          <Select
          style={{ width: 120 }}
          placeholder='Role'
          options={[
            { value: 'User', label: 'User' },
            { value: 'Admin', label: 'Admin' },
          ]}
          disabled={signupLoading}
          />
        </Form.Item>
        
        <Space
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '24px 0 0',
        }}
        >
          <Form.Item style={{margin: 0}}>
            <Button onClick={() => setShowAddUserModal(false)} style={{width: 80}} disabled={signupLoading}>
              CANCEL
            </Button>
          </Form.Item>

          <Form.Item style={{margin: 0}}>
            <Button type='primary' htmlType='submit' style={{width: 80}} loading={signupLoading}>
              SAVE
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  )
}

const PasswordModal = (props) => {
  const {
    showPasswordModal,
    setShowPasswordModal,
    newUsernameAndPassword,
    setNewUsernameAndPassword,
    colorPrimaryBg,
    borderRadius,
    resetPassword,
    setResetPassword,
  } = props

  const handleClose = () => {
    setShowPasswordModal(false)
    setResetPassword(false)
    setNewUsernameAndPassword(null)
  }
  return (
    <Modal
    title={resetPassword ? 'RESET PASSWORD' : 'ADDED NEW USER'}
    open={showPasswordModal} 
    footer={null} 
    closable={false}
    destroyOnClose
    style={{
      textAlign: 'center',
      minWidth: '300px',
    }}
    >
      <Space
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '30px',
        background: colorPrimaryBg,
        padding: '10px',
        borderRadius,
      }}
      >
        <Space
        style={{
          display: 'flex',
          columnGap: '10px',
        }}
        >
          <Space
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
          >
            <Text>
              username:
            </Text>
            <Title level={4} style={{margin: 0}} copyable>
              {newUsernameAndPassword?.username}
            </Title>
          </Space>
          
          <Space
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
          >
            <Text>
              password:
            </Text>
            <Title level={4} style={{margin: 0}} copyable>
              {newUsernameAndPassword?.password}
            </Title>
          </Space>
        </Space>

        <Button onClick={handleClose}>
          CLOSE
        </Button>
      </Space>
    </Modal>
  )
}

export default function Users() {
  const {
    token: { colorBgContainer, colorPrimaryBg, borderRadius, colorError, colorInfo },
  } = theme.useToken();

  const dispatch = useDispatch()

  const allUsers = useSelector(state => state.usersReducer.allUsers)
  const allUsersLoading = useSelector(state => state.usersReducer.allUsersLoading)
  const allUsersArray = useSelector(state => state.utilityReducer.allUsersArray)
  const usesTableData = useSelector(state => state.utilityReducer.usesTableData)

  const updateUserSuccess = useSelector(state => state.usersReducer.updateUserSuccess)
  const updateUserLoading = useSelector(state => state.usersReducer.updateUserLoading)
  const updateUserFailed = useSelector(state => state.usersReducer.updateUserFailed)

  const signupSuccessData = useSelector(state => state.usersReducer.signupSuccessData)
  const signupLoading = useSelector(state => state.usersReducer.signupLoading)
  const signupFailed = useSelector(state => state.usersReducer.signupFailed)

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [form] = Form.useForm();
  const [tempData, setTempData] = useState(null);
  const [editingKey, setEditingKey] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUsernameAndPassword, setNewUsernameAndPassword] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);

  const searchInput = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();

  const tableData = useMemo(() => {
    const data = [];
    if (allUsersArray && allUsersArray.length > 0) {
      for (let i = 0; i < allUsersArray.length; i++) {
        const user = allUsersArray[i];
        data.push({
          key: i,
          userId: user._id,
          name: user.name,
          username: user.username,
          email: user.email ? user.email : '',
          role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
          active: user.isActive ? 'Yes' : 'No',
          status: user.isOnline ? 'online' : 'offline'
        })
      }
    }
    return data
  }, [allUsersArray])
 

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button> */}
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button> */}
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),

    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),

    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },

    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      editable: false,
      width: 100,
      filters: [
        {
          text: 'Online',
          value: 'online',
        },
        {
          text: 'Offline',
          value: 'offline',
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      editable: true,
      sorter: (a, b) => a.username.localeCompare(b.username),
      ...getColumnSearchProps('username'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      editable: true,
      sorter: (a, b) => a.email.localeCompare(b.email),
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      editable: true,
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: 'Active',
      dataIndex: 'active',
      editable: true,
      sorter: (a, b) => a.active.localeCompare(b.active),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          > 
            <span
            style={{
              display: 'flex',
              flexWrap: 'wrap'
            }}
            >
              <Typography.Link
                onClick={() => save(record.key)}
                style={{
                  marginRight: 8,
                }}
              >
                Save
              </Typography.Link>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
            
            <Popconfirm title="Sure to reset password?" onConfirm={() => handleResetPassword(record)}>
              <Button
              type='dashed'
              danger
              >
                Reset
              </Button>
            </Popconfirm>
          </Space>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ]

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      username: '',
      email: '',
      role: '',
      active: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      console.log('row', row)
      row.name = row.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
      const newData = [...usesTableData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        const updatedUserData = {
          userId: item.userId,
          body: {
            username: row.username,
            email: row.email ? row.email  : null,
            name: row.name,
            role: row.role.toLowerCase(),
            isActive: row.active === 'Yes' ? true : false
          }
        }

        dispatch(updateUser(updatedUserData))
        setTempData(newData);
      } else {
        newData.push(row);
        dispatch(setUsersTableData(newData))
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === 'select' ?
    <Select
    options={
      title === 'Role' ?
      [
        { value: 'Admin', label: 'Admin' },
        { value: 'User', label: 'User' },
      ]
      :
      title === 'Active' ?
      [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
      ] : null
    }
    />
    : <Input placeholder={title}/>;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                validator: async (_, value) => {
                  if (value) {
                    if (updateUserFailed) {
                      return Promise.reject(`Updating details failed!`);
                    }

                    const isNameValid = /^[ñÑA-Za-z\s]*$/.test(value)
                    const isEmailValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
                    const isUserNameValid = /^[a-z0-9_\.]+$/.test(value)

                    if (title === 'Name' && isNameValid) {
                      return Promise.resolve();
                    }

                    if (title === 'Username' && isUserNameValid) {
                      return Promise.resolve();
                    }

                    if (title === 'Email' && isEmailValid) {
                      return Promise.resolve();
                    }

                    if (title === 'Role' || title === 'Active') {
                      return Promise.resolve();
                    }
                    
                    return Promise.reject(`Please Input valid ${title}!`);
                  } else {
                    if (title === 'Email') {
                      return Promise.resolve();
                    }

                    return Promise.reject(`Please Input ${title}!`);
                  }
                },
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const tableColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      ellipsis: true,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'role' || col.dataIndex === 'active' ? 'select' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const tableProps = {
    // bordered: true,
    loading: updateUserLoading || signupLoading || allUsersLoading,
    size: 'large',
    expandable: {
      expandedRowRender: (record) => <p>{record.name}</p>,
    },
    // rowSelection: {},
    components: {
      body: {
        cell: EditableCell,
      },
    },
    scroll: {
      x: 1000,
      // y: 300,
    }
  };

  useEffect(() => {
    if (!usesTableData) {
      dispatch(setUsersTableData(tableData))
    }

    if (updateUserSuccess && !updateUserLoading && !updateUserFailed && allUsersArray && allUsersArray.length > 0) {
      if (resetPassword) {
        setShowPasswordModal(true)
        messageApi.open({
          type: 'success',
          content: 'User password updated!',
        });
      } else {
        allUsersArray.forEach((element, index) => {
          if (element._id === updateUserSuccess.data._id) {
            allUsersArray[index] = updateUserSuccess.data
          }
        });
        dispatch(setUsersTableData(tempData))
        messageApi.open({
          type: 'success',
          content: 'User details updated!',
        });
      }

      setEditingKey('');
      dispatch(updateUserReset())
    }

    if (updateUserFailed) {
      console.log('updateUserFailed', updateUserFailed)
      messageApi.open({
        type: 'error',
        content: 'Updating user failed!',
      });
      dispatch(updateUserReset())
    }

    if (signupSuccessData && !signupLoading && !signupFailed) {
      const newUser = {
        key: usesTableData.length,
        name: signupSuccessData.data.name,
        username: signupSuccessData.data.username,
        email: signupSuccessData.data.email ? signupSuccessData.data.email : '',
        role: signupSuccessData.data.role,
        active: signupSuccessData.data.isActive ? 'Yes' : 'No',
        userId: signupSuccessData.data._id,
        status: 'offline',
      }
      dispatch(setUsersTableData([newUser, ...usesTableData]))
      
      messageApi.open({
        type: 'success',
        content: 'Added new user!',
      });

      setShowAddUserModal(false)
      setShowPasswordModal(true)
      dispatch(fetchAllUsers())
      dispatch(signUpReset())
    }

    if (signupFailed) {
      console.log('signupFailed', signupFailed)
      messageApi.open({
        type: 'error',
        content: signupFailed.data.message ? signupFailed.data.message : 'Adding new user failed!',
      });
      dispatch(signUpReset())
    }
  }, [
    dispatch,
    updateUserSuccess,
    updateUserLoading,
    updateUserFailed,
    allUsers,
    messageApi,
    tempData,
    signupSuccessData,
    signupLoading,
    signupFailed,
    resetPassword,
    usesTableData,
    allUsersArray,
    tableData,
  ])

  const addUser = (value) => {
    let password = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 6) {
      password += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    
    const newUserData = {
      username: value.username,
      name: value.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()),
      password,
      email: value.email ? value.email : null,
      role: value.role.toLowerCase(),
    }

    console.log('password', password)
    setNewUsernameAndPassword({
      username: newUserData.username,
      password,
    })

    dispatch(signUp(newUserData))
  }

  const handleResetPassword = (value) => {
    let password = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 6) {
      password += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    const updatedUserData = {
      userId: value.userId,
      body: {
        password
      }
    }

    dispatch(updateUser(updatedUserData))

    setNewUsernameAndPassword({
      username: value.username,
      password
    })
    setResetPassword(true)
  }

  const handleUserTableReload = () => {
    dispatch(fetchAllUsers())
    dispatch(setUsersTableData([...tableData]))
  }

  return (
    <UsersStyled>
      {contextHolder}
      <Space
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '0 0 16px 0'
      }}
      >
        <Title className='prevent-select' level={4} style={{margin: '0'}}>USERS</Title>

        <Tooltip title='Add User'>
          <Button type='primary' size='small' onClick={() => setShowAddUserModal(true)}>
            <PlusOutlined />
          </Button>
        </Tooltip>
        
        <AddUserModal
        showAddUserModal={showAddUserModal}
        setShowAddUserModal={setShowAddUserModal}
        colorPrimaryBg={colorPrimaryBg}
        borderRadius={borderRadius}
        addUser={addUser}
        signupLoading={signupLoading}
        />
        <PasswordModal
        showPasswordModal={showPasswordModal}
        setShowPasswordModal={() => setShowPasswordModal()}
        newUsernameAndPassword={newUsernameAndPassword}
        setNewUsernameAndPassword={setNewUsernameAndPassword}
        colorPrimaryBg={colorPrimaryBg}
        borderRadius={borderRadius}
        resetPassword={resetPassword}
        setResetPassword={setResetPassword}
        />
      </Space>
      <Button type='dashed' onClick={handleUserTableReload}>Reload</Button>
      
      <Form form={form} component={false}>
        <Table
          {...tableProps}
          pagination={{
            position: ['topRight', 'bottomRight'],
            onChange: cancel,
          }}
          columns={tableColumns}
          dataSource={usesTableData}
        />
      </Form>
    </UsersStyled>
  )
}
