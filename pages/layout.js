import React, { useEffect, useRef, useState } from 'react'
import * as pallete from '@/styles/variables'
// import Footer from '@/components/footer/footer'
import Scrollbars from '@/components/utility/customScrollbar'
import Head from 'next/head'
import useWindowSize from '@/helpers/useWindowSize'
import { useRouter } from 'next/router'
import LoadingPage from '@/pages/loadingPage'
import { useDispatch, useSelector } from 'react-redux'
import authActions from '@/redux/auth/actions'
import utilityActions from '@/redux/utility/actions'
import { io } from 'socket.io-client';
import usersAction from '@/redux/users/actions'
import conversationAction from '@/redux/conversation/actions'
import { message } from 'antd'

const socket = io.connect(process.env.NEXT_PUBLIC_API_SOCKETURL)

const { 
  authenticate,
} = authActions;

const {
  fetchAllUsers,
} = usersAction

const {
  fetchConversationByUserId,
} = conversationAction

const {
  setView,
  setScrollbarUseRef,
  setSocketIo,
  setCurrentOnlineUsers,
  setConversationArray,
  setAllUsersArray,
  setUsersTableData,
} = utilityActions;

const arrayPath = [
  {
    path: '/',
    name: 'home',
    allowed: 'any',
  },
  {
    path: '/error',
    name: 'error',
    allowed: 'any',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    allowed: 'users',
  },
  {
    path: '/login',
    name: 'login',
    allowed: 'any',
  },
]

export default function Layout({ children }) {
  const dispatch = useDispatch()
  const router = useRouter()
  // const queryData = router.query
  const windowSize = useWindowSize()

  // const view = useSelector(state => state.utilityReducer.view)
  const scrollbarUseRef = useSelector(state => state.utilityReducer.scrollbarUseRef)

  const usersData = useSelector(state => state.authReducer.usersData)
  const userId = usersData && usersData.data ? usersData.data._id : null
  const role = usersData?.data?.role
  const logoutLoading = useSelector(state => state.authReducer.logoutLoading)
  const authenticateLoading = useSelector(state => state.authReducer.authenticateLoading)
  const authenticateFailed = useSelector(state => state.authReducer.authenticateFailed)
  const socketIo = useSelector(state => state.utilityReducer.socketIo)
  const allUsers = useSelector(state => state.usersReducer.allUsers)
  const allUsersLoading = useSelector(state => state.usersReducer.allUsersLoading)
  const allUsersFailed = useSelector(state => state.usersReducer.allUsersFailed)

  const fectchConversationByUserIdData = useSelector(state => state.conversationReducer.fectchConversationByUserIdData)
  const fectchConversationByUserIdLoading = useSelector(state => state.conversationReducer.fectchConversationByUserIdLoading)
  const fectchConversationByUserIdFailed = useSelector(state => state.conversationReducer.fectchConversationByUserIdFailed)

  const conversationArray = useSelector(state => state.utilityReducer.conversationArray)
  const allUsersArray = useSelector(state => state.utilityReducer.allUsersArray)

  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(false)
  const [socketJoined, setSocketJoined] = useState(false)

  const scrollbar = useRef(null)
  const [messageApi, messageContextHolder] = message.useMessage();

  useEffect(() => {
    // console.log('routerAsPath', router.asPath);
    // console.log('routerQuery', router.query);

    // FOR HANDLING PAGE ROUTERS
    if (router && loading) {
      const isExist = arrayPath.find(path => router.asPath === path.path)
      if (isExist) {
        // console.log(isExist)
        if (isExist.allowed === 'any') {
          if (isExist.path === '/') {
            router.push('/login')
          }
          setLoading(false)
        } else if (isExist.allowed === 'users') {
          if (usersData) {
            setLoading(false)
          } else if (authenticateFailed) {
            router.push('/')
						scrollbar?.current?.scrollToTop({ behavior: 'smooth' })
          }
        }
      } else {
        router.push('/404')
        setLoading(false)
      }
    }

    // FOR SETTING VIEW TO AVOID ERROR
    if (windowSize) {
      dispatch(setView(windowSize))
    }

    // FOR HANDLING LOADING PAGE
    if (logoutLoading || authenticateLoading || fectchConversationByUserIdLoading) {
      setLoading(true)
    }

    // FOR HANDLING AUTHENTICATION
    if (!usersData && !authenticateFailed && !authenticateLoading) {
      dispatch(authenticate())
    }

    // FOR SCROLLBAR USEREF
    if (scrollbar && !scrollbarUseRef) {
      dispatch(setScrollbarUseRef(scrollbar))
    }

    // FOR FETCHING ALL USERS
    if (role === 'admin' && !allUsers && !allUsersLoading && !allUsersFailed) {
      dispatch(fetchAllUsers())
    }

    if (role === 'admin' && allUsersArray.length === 0 && allUsers && allUsers.data.length > 0) {
      dispatch(setAllUsersArray(allUsers.data))
    }

    // FOR CONVERSATION
    if (userId && !fectchConversationByUserIdData && !fectchConversationByUserIdLoading && !fectchConversationByUserIdFailed) {
      dispatch(fetchConversationByUserId({userId}))
    }

    // FOR HANDLING SOCKET IO
    if (!socketIo) {
      dispatch(setSocketIo(socket))
    }
    
    if (!isOnline && userId) {
      socket.emit('online', userId)
      setIsOnline(true)
      // dispatch(authenticate())
    }

    if (!socketJoined && fectchConversationByUserIdData && fectchConversationByUserIdData.data.length > 0) {
      socket.emit('personal_room', userId)
      fectchConversationByUserIdData.data.map(conversation => socket.emit('join_conversation', conversation))
      
      // fectchConversationByUserIdData.data.map(conversation => {
      //   const sentMessageArray = conversation.messages.filter(message => {
      //     if (message.status === 'sent' && message.userId !== userId) {
      //       return message
      //     }
      //   })

      //   if (sentMessageArray.length > 0) {
      //     sentMessageArray.map(message =>{
      //       dispatch(updateMessage({
      //         messageId: message._id,
      //         body: {
      //           status: 'received'
      //         }
      //       }))
      //       message.status = 'received'
      //       socket.emit('received_message', message);
      //     })
      //   }
      // })
      
      dispatch(setConversationArray(fectchConversationByUserIdData.data))
      setSocketJoined(true)
    }

    const incommingUser = (incommingUser) => {
      const filteredConversationsArray = conversationArray.filter(conversation => conversation.participants.map(participant => {
        return participant._id === incommingUser._id
      }))

      for (let i = 0; i < filteredConversationsArray.length; i++) {
        const conversation = filteredConversationsArray[i];
        const findIndex = conversation.participants.findIndex(participant => participant._id === incommingUser._id)
        if (findIndex > -1) {
          conversation.participants.splice(findIndex, 1, {
            ...conversation.participants[findIndex],
            isOnline: incommingUser.isOnline
          })
        }
        
      }
      dispatch(setConversationArray([...conversationArray]))
      
      if (role === 'admin' && incommingUser) {
        const index = allUsersArray.findIndex((item) => incommingUser._id === item._id )
        if (index > -1) {
          allUsersArray.splice(index, 1, incommingUser)
          dispatch(setAllUsersArray([...allUsersArray]))
          dispatch(setUsersTableData(null))
        }
      }
    }

    const newParticipantAdded = (conversation) => {
      const conversationIndex = conversationArray.findIndex(item => item._id === conversation._id)
      if (conversationIndex > -1) {
        const oldConversation = conversationArray[conversationIndex];
        conversationArray.splice(conversationIndex, 1, {...oldConversation,...conversation,});
        dispatch(setConversationArray([...conversationArray]))
      }
    }

    const addedInConversation = (conversation) => {
      socket.emit('join_conversation', conversation)
      dispatch(setConversationArray([conversation, ...conversationArray]))
      messageApi.open({
        type: 'info',
        content: `Your are added in ${conversation.name}!`,
      });
    }

    const participantRemoved = (conversation) => {
      const conversationIndex = conversationArray.findIndex(item => item._id === conversation._id)
      if (conversationIndex > -1) {
        const oldConversation = conversationArray[conversationIndex];
        conversationArray.splice(conversationIndex, 1, {...oldConversation,...conversation,});
        dispatch(setConversationArray([...conversationArray]))
      }
    }

    const removedInConversation = (conversation) => {
      socket.emit('leave_conversation', conversation)
      const conversationIndex = conversationArray.findIndex(item => item._id === conversation._id)
      if (conversationIndex > -1) {
        conversationArray.splice(conversationIndex, 1);
        dispatch(setConversationArray([...conversationArray]))
      }
      messageApi.open({
        type: 'info',
        content: `Your are removed in ${conversation.name}!`,
      });
    }

    const conversationDeleted = (conversation) => {
      socket.emit('leave_conversation', conversation)
      const conversationIndex = conversationArray.findIndex(item => item._id === conversation._id)
      if (conversationIndex > -1) {
        conversationArray.splice(conversationIndex, 1);
        dispatch(setConversationArray([...conversationArray]))
      }
      messageApi.open({
        type: 'info',
        content: `${conversation.name} is deleted!`,
      });
    }

    socket.on('incomming_user', incommingUser)
    socket.on('new_participant_added', newParticipantAdded)
    socket.on('added_in_conversation', addedInConversation)
    socket.on('participant_removed', participantRemoved)
    socket.on('removed_in_conversation', removedInConversation)
    socket.on('conversation_deleted', conversationDeleted)

    return () => socket.off();
  }, [
    dispatch,
    userId,
    role,
    windowSize,
    loading,
    router,
    scrollbarUseRef,
    logoutLoading,
    authenticateLoading,
    usersData,
    authenticateFailed,
    socketIo,
    isOnline,
    allUsers,
    allUsersLoading,
    allUsersFailed,
    fectchConversationByUserIdData,
    fectchConversationByUserIdLoading,
    fectchConversationByUserIdFailed,
    socketJoined,
    allUsersArray,
    conversationArray,
    messageApi,
  ])

  return (
    <>
      <Head>
        <meta name="theme-color" content={pallete.theme.primary} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content={pallete.theme.primary} />
        <meta name="norton-safeweb-site-verification" content="-hol51gs638ao4sh1rb2bit9os06b-sogydolz0tbtf34emmdm82llr4s7jt9rcw484e50so2xxxddugpmqe9ghrbskrgm3egt5gbnpr3wa1znxr4d-g7-ecxmebp1gx" />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
        <link rel="icon" href="/anvari-logo.png" type="image/icon type"/>

        {/* FOR FONTS */}
        {/* <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"/> */}


        {/* FOR PWA */}
        <meta name="application-name" content="Fenrir App" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Fenrir App" />
        <meta name="description" content="Fenrir App" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* <meta name="msapplication-config" content="/icons/browserconfig.xml" /> */}
        <meta name="msapplication-TileColor" content={pallete.theme.primary} />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" /> */}

        {/* <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" /> */}
        <link rel="manifest" href="/manifest.json" />
        {/* <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" /> */}
        {/* <link rel="shortcut icon" href="/favicon.ico" /> */}
        {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" /> */}

        {/* <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://yourdomain.com" />
        <meta name="twitter:title" content="PWA App" />
        <meta name="twitter:description" content="Best PWA App in the world" />
        <meta name="twitter:image" content="https://yourdomain.com/icons/android-chrome-192x192.png" />
        <meta name="twitter:creator" content="@DavidWShadow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PWA App" />
        <meta property="og:description" content="Best PWA App in the world" />
        <meta property="og:site_name" content="PWA App" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:image" content="https://yourdomain.com/icons/apple-touch-icon.png" /> */}

        {/* apple splash screen images */}

        {/* <link rel='apple-touch-startup-image' href='/images/apple_splash_2048.png' sizes='2048x2732' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_1668.png' sizes='1668x2224' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_1536.png' sizes='1536x2048' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_1125.png' sizes='1125x2436' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_1242.png' sizes='1242x2208' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_750.png' sizes='750x1334' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_640.png' sizes='640x1136' /> */}

        <title>Fenrir</title>
      </Head>
      {messageContextHolder}
      {
        loading ? <LoadingPage/>
        :
        <Scrollbars style={{minHeight: '100vh'}} ref={scrollbar} >
          {children}

          {/* {
            router.asPath === '/404' ? null : 
            <Footer />
          } */}
        </Scrollbars>
      }
    </>
  )
}
