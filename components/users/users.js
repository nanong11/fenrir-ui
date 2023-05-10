import React, { useEffect, useRef, useState } from 'react'
import UsersStyled from './users.styles'
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Typography, message, theme } from 'antd'
import usersActions from '@/redux/users/actions'
import { useDispatch, useSelector } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words';

const {
  updateUser,
  updateUserReset,
} = usersActions

const { Title } = Typography

export default function Users(props) {
  const {
    allUsers
  } = props
  console.log('allUsers', allUsers)

  const {
    // token: { colorBgContainer, colorPrimaryBg, borderRadius, colorError, colorInfo },
  } = theme.useToken();

  const tableData = []
  if (allUsers && allUsers.data.length > 0) {
    for (let i = 0; i < allUsers.data.length; i++) {
      const user = allUsers.data[i];
      tableData.push({
        key: i,
        userId: user._id,
        name: user.name,
        username: user.username,
        email: user.email ? user.email : '',
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        active: user.isActive ? 'Yes' : 'No',
      })
    }
  }

  const dispatch = useDispatch()

  const updateUserSuccess = useSelector(state => state.usersReducer.updateUserSuccess)
  const updateUserLoading = useSelector(state => state.usersReducer.updateUserLoading)
  const updateUserFailed = useSelector(state => state.usersReducer.updateUserFailed)

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [form] = Form.useForm();
  const [data, setData] = useState(tableData);
  const [tempData, setTempData] = useState(null);
  const [editingKey, setEditingKey] = useState('');

  const searchInput = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();

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
          <span>
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
      row.name = row.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
      const newData = [...data];
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
        setData(newData);
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
    loading: updateUserLoading,
    size: 'middle',
    expandable: {
      expandedRowRender: (record) => <p>{record.name}</p>,
    },
    // rowSelection: {},
    components: {
      body: {
        cell: EditableCell,
      },
    },
  };

  useEffect(() => {
    if (updateUserSuccess && !updateUserLoading && !updateUserFailed && allUsers && allUsers.data.length > 0) {
      allUsers.data.forEach((element, index) => {
        if (element._id === updateUserSuccess.data._id) {
          allUsers.data[index] = updateUserSuccess.data
        }
      });
      setData(tempData)
      setEditingKey('');
      dispatch(updateUserReset())
      messageApi.open({
        type: 'success',
        content: 'User details updated!',
      });
    }

    if (updateUserFailed) {
      console.log('updateUserFailed', updateUserFailed)
      messageApi.open({
        type: 'error',
        content: 'Updating user failed!',
      });
      dispatch(updateUserReset())
    }
  }, [
    dispatch,
    updateUserSuccess,
    updateUserLoading,
    updateUserFailed,
    allUsers,
    messageApi,
    tempData,
  ])

  return (
    <UsersStyled>
      {contextHolder}
      <Title level={3} style={{margin: '0 0 20px 0'}}>USERS</Title>
      <Form form={form} component={false}>
        <Table
          {...tableProps}
          pagination={{
            position: ['topRight', 'bottomRight'],
            onChange: cancel,
          }}
          columns={tableColumns}
          dataSource={data}
        />
      </Form>
    </UsersStyled>
  )
}
