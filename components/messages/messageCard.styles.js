import styled from "styled-components";
// import * as pallete from '@/styles/variables';

const MessageCardStyled = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .message-card-main-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .message-card-list-wrapper {
        height: 100%;
      }
  
      .message-form {
        display: flex;
        justify-content: space-between;
        align-items: center;
        column-gap: 10px;
        /* background: ${props => props.colorprimarybghover}; */
        padding: 0 16px;
        border-top: 2px solid ${props => props.colorprimarybg};
        border-bottom: 2px solid ${props => props.colorprimarybg};
  
        .message-upload-btn {
          .ant-btn {
            border: none;
            text-shadow: none;
            box-shadow: none;
          }
        }

        .files-message-input-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;

          .ant-upload-wrapper {
            display: flex;

            .ant-upload-list {
              display: flex;
              flex-wrap: wrap;
              max-height: 80px;
              overflow: auto;

              .ant-upload-list-item-container {
                width: 100px;
              }
            }
          }
        }

        .message-form-input {
          width: 100%;
          padding: 3px 0;

          .content-editable-cont-1 {
            max-height: 80px;
            width: 100%; 
            overflow: auto;
  
            .content-editable-cont-2 {
              min-height:100%;
    
              .input-area {
                font-size: 1rem;
                line-height: 16px;
                outline: none;
                -webkit-user-select: text;
                -moz-user-select: text;
                -ms-user-select: text;
                user-select: text;
                word-wrap: break-word;
                overflow: hidden;

                img {
                  max-height: 60px;
                  margin: 3px 3px 3px 0;
                  border-radius: 3px;
                }
              }
            }
          }

          [contenteditable][placeholder]:empty:before {
            content: attr(placeholder);
            position: absolute;
            color: ${props => props.colortexttertiary};
            background-color: transparent;
            font-size: .8rem;
            letter-spacing: 1px;
          }
        }

        .message-form-btn {
          padding: 3px 0;
          .ant-btn {
            background-color: inherit;
            color: ${props => props.colorprimary};
            text-shadow: none;
            box-shadow: none;
          }
    
          .ant-btn-primary:hover, .ant-btn-primary:focus {
            background-color: inherit !important;
          }
        }
      }

      .ant-form-item {
        margin: 0;
      }
    }

    
`;

export default MessageCardStyled;
