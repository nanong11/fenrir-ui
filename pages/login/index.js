import React, { useEffect, useState } from 'react'
import LoginStyled from './login.styles';
import { Button, Form, Input, Modal, theme, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import authActions from '@/redux/auth/actions'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const {
  login,
  loginReset
} = authActions

const { Text } =Typography

export default function Login() {
  const {
    token: { colorBgContainer, colorPrimaryBg, borderRadius, colorError, colorInfo },
  } = theme.useToken();

  const dispatch = useDispatch()
  const router = useRouter()
  const [loginForm] = Form.useForm();

  const usersData = useSelector(state => state.authReducer.usersData)
  const loginLoading = useSelector(state => state.authReducer.loginLoading)
  const loginFailed = useSelector(state => state.authReducer.loginFailed)

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (usersData) {
      router.push('/dashboard')
    }

    if (loginFailed) {
      loginForm.validateFields()
    }
  }, [
    usersData,
    loginFailed,
    loginForm,
    router
  ])

  const onFinish = (values) => {
    dispatch(login(values))
  };

  const onValuesChange = (changedValues, allValues) => {
    dispatch(loginReset())
  }

  return (
    <LoginStyled style={{ background: colorBgContainer, }}>
      {
        !usersData ?
        <Form
        name='loginForm'
        initialValues={{ remember: true }}
        form={loginForm}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        size='large'
        style={{
          padding: '24px',
          margin: '24px',
          background: colorPrimaryBg,
          borderRadius: borderRadius,
          minWidth: '200px',
          width: '350px',
          display: 'flex',
          flexDirection: 'column'
        }}
        >
          {
            loginFailed ?
            <Form.Item style={{textAlign: 'center'}}>
              <Text style={{color: colorError}}>Incorrect Username or Password!</Text>
            </Form.Item>
            : null
          }

          <Form.Item
          name='username'
          rules={[
            { required: true, message: 'Please input your Username!' },
            {
              validator: async (_, value) => {
                console.log('value', value)
                if (value && loginFailed) {
                  return Promise.reject();
                }
              },
            },
          ]}
          >
            <Input prefix={<UserOutlined />} placeholder='username' />
          </Form.Item>

          <Form.Item
          name='password'
          rules={[
            { required: true, message: 'Please input your Password!' },
            {
              validator: async (_, value) => {
                console.log('value', value)
                if (value && loginFailed) {
                  return Promise.reject();
                }
              },
            },
          ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder='password' />
          </Form.Item>

          <Form.Item
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '10px 0 0 0'
          }}
          >
            <Button type="primary" htmlType="submit" loading={loginLoading}>
              LOGIN
            </Button>
          </Form.Item>

          <Form.Item style={{textAlign: 'center', margin: '0'}}>
            <Text style={{color: colorInfo, margin: '0', cursor: 'pointer'}} onClick={() => setIsModalOpen(true)}>Forgot Password</Text>
          </Form.Item>
        </Form>
        : null
      }

      <Modal
      open={isModalOpen}
      closable={false}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      width='350px'
      style={{textAlign: 'center'}}
      >
        <Text style={{color: colorInfo}}>Contact your admin to reset your password.</Text>
      </Modal>
      
    </LoginStyled>
  )
}
