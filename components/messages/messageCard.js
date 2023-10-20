import React, { useEffect, useState } from 'react'
import MessageCardStyled from './messageCard.styles'
import { Button, Form, Upload, theme } from 'antd'
import { PlusOutlined, SendOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import getBase64 from '@/helpers/getBase64';

export default function MessageCard(props) {
  const {
    currentChannel
  } = props;
  console.log('CHECK_currentChannel', currentChannel)

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

  const [messageForm] = Form.useForm();

  const usersData = useSelector(state => state.authReducer.usersData)
  const userId = usersData && usersData.data ? usersData.data._id : null

  const [fileList, setFileList] = useState([]);
  const [imageArrSrc, setImageArrSrc] = useState([]);
  const [filesArrSrc, setFilesArrSrc] = useState([]);
  const [addFileButtonLoading, setAddFileButtonLoading] = useState(false);
  console.log('CHECK_imageArrSrc', imageArrSrc)
  console.log('CHECK_filesArrSrc', filesArrSrc)

  const editableDiv = document.getElementById('editable-div');

  const handleSendMessage = () => {
    const text = editableDiv.innerText.trim()
    
    const imageArr = editableDiv.getElementsByTagName('img')
    const copyPasteImgArr = []
    if (imageArr?.length > 0) {
      for (let i = 0; i < imageArr.length; i++) {
        const img = imageArr[i];
        copyPasteImgArr.push({
          uid: null,
          url: img.src,
          order: imageArrSrc.length + 1
        })
      }
    }
    
    const messageData = {
      userId,
      conversationId: currentChannel._id,
      text: text,
      media: copyPasteImgArr.length > 0 ? [...imageArrSrc, ...copyPasteImgArr] : imageArrSrc,
      files: filesArrSrc,
    }
    console.log('CHECK_messageData', messageData)

    // if (selectedConversation && !createMessageData) {
    //   const messageData = {
    //     userId,
    //     conversationId: selectedConversation._id,
    //     text: text,
    //     media: imageArrSrc,
    //   }
    //   console.log('CHECK_messageData', messageData)
    //   dispatch(createMessage(messageData))
    // }
    
    setFileList([])
    setImageArrSrc([])
    setFilesArrSrc([])
    editableDiv.replaceChildren('')
    editableDiv.focus()
  }

  editableDiv?.addEventListener('keypress', (e) => {
    if (e.key === "Enter" && !e.shiftKey ) {
      e.preventDefault()
      // handleSendMessage()
    }
  })

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },

    beforeUpload: (file) => {
      console.log('CHECK_file', file)
      if (file.type.includes('image') || file.type.includes('application')) {
        setFileList([...fileList, file]);
      }
    },

    onChange: (info) => {
      console.log('CHECK_info', info)
      if (info.file.status === 'uploading') {
          setAddFileButtonLoading(true)
          return;
      }

      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, (url) => {
          if (info.file.type.includes('image')) {
            setImageArrSrc([...imageArrSrc, {
              uid: info.file.uid,
              url,
              order: imageArrSrc.length + 1
            }])
          }

          if (info.file.type.includes('application')) {
            setFilesArrSrc([...filesArrSrc, {
              uid: info.file.uid,
              url,
              order: filesArrSrc.length + 1
            }])
          }
        });

        setAddFileButtonLoading(false)
      }

      if (info.file.status === 'removed') {
        const isImageExist = imageArrSrc.find(item => item.uid === info.file.uid)
        const isFileExist = filesArrSrc.find(item => item.uid === info.file.uid)

        if (isImageExist) {
          const filteredImageUrlArray = imageArrSrc.filter(item => item.uid !== info.file.uid)
          // filteredImageUrlArray.sort((a, b) => a.order - b.order)
          const newImageUrlArray = []
          let count = 1
          filteredImageUrlArray.map(item => {
            item.order = count
            newImageUrlArray.push(item)
            count += 1
          })
          if (newImageUrlArray.length === filteredImageUrlArray.length) {
            setImageArrSrc([...newImageUrlArray])
          }
        }

        if (isFileExist) {
          const filteredFileUrlArray = filesArrSrc.filter(item => item.uid !== info.file.uid)
          // filteredFileUrlArray.sort((a, b) => a.order - b.order)
          const newFileUrlArray = []
          let count = 1
          filteredFileUrlArray.map(item => {
            item.order = count
            newFileUrlArray.push(item)
            count += 1
          })
          if (newFileUrlArray.length === filteredFileUrlArray.length) {
            setFilesArrSrc([...newFileUrlArray])
          }
        }

        setAddFileButtonLoading(false)
      }
    },

    customRequest: ({ /* file, */ onSuccess }) => {
      setTimeout(() => {
          onSuccess("ok");
      }, 0);
    },
    
    fileList,
  };

  return (
    <MessageCardStyled
    colorprimarybg={colorPrimaryBg}
    colorprimary={colorPrimary}
    colorprimarybghover={colorPrimaryBgHover}
    colortexttertiary={colorTextTertiary}
    >
      <div className='message-card-main-wrapper'>
        <div
        className='message-card-list-wrapper'>
          TEST
        </div>

        <Form
        className='message-form'
        name="messageForm"
        form={messageForm}
        autoComplete="off"
        onFinish={handleSendMessage}
        >
          <div className='files-message-input-wrapper' style={{flexDirection: fileList.length > 0 ? 'column' : 'row', alignItems: fileList.length > 0 ? 'flex-start' : 'center'}}>
            <Form.Item name='files' className='message-upload-btn'>
              <Upload {...uploadProps}>
                <Button icon={<PlusOutlined />} loading={addFileButtonLoading} />
              </Upload>
            </Form.Item>

            <Form.Item name="message" className='message-form-input'>
              <div className='content-editable-cont-1'>
                <div className='content-editable-cont-2'>
                  <div className='input-area' contentEditable="true" id="editable-div" placeholder='Type a message...'>
                  
                  </div>
                </div>
              </div>
            </Form.Item>
          </div>

          <Form.Item className='message-form-btn'>
            <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined style={{fontSize: '1.1rem'}} />}
            />
          </Form.Item>
        </Form>
      </div>
    </MessageCardStyled>
  )
}
