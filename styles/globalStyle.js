import { createGlobalStyle } from 'styled-components';
import * as pallete from './variables';

const GlobalStyles = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    scroll-behavior: smooth;
    /* background: ${pallete.theme.pageBackgroundColorLight}; */
  }

  * {
    box-sizing: border-box;
  }

  iframe {
    border: 'none';
  }
  
  a {
    /* color: ${pallete.theme.primary}; */
    text-decoration: none;
  }

  a:hover {
    color: #000000;
    text-shadow: 0 3px 10px rgb(0 0 0 / 10%);
    text-decoration: none;
  }
  
  .img {
    transition: all .5s ease;
  }

  .scroll-view {
    -webkit-overflow-scrolling: auto !important;
  }

  .prevent-select {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }

  /*-----------------------------------------------*/
  /*  Ant Design Custom Default Theme */
  /*-----------------------------------------------*/

  .anticon-loading {
    color: ${pallete.theme.primary};
  }

  /* .ant-message-notice-content {
    background-color: ${pallete.theme.primary} !important;
    color: #ffffff;
    border-radius: 42px !important;
  }
 */
 /*  .ant-btn {
    background-color: ${pallete.theme.primary};
    border: none;
    color: #ffffff;
    border-radius: 5px;

    .anticon-loading {
      color: #fff;
    }
  } */

  /* .ant-btn:hover {
    background-color: ${pallete.theme.primary};
    color: #ffffff !important;
  } */

  /* .ant-btn:focus {
    background-color: ${pallete.theme.primary};
    color: #ffffff;
  } */

 /*  .ant-btn-primary:hover, .ant-btn-primary:focus {
    color: #fff;
    border-color: ${pallete.theme.primary} !important;
    background: ${pallete.theme.primary} !important;
  }
 */
  /* .ant-dropdown-menu {
    border-radius: 10px;
    margin-top: 5px;
    padding: 5px;
  }
 */
  /* .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title {
    padding: 5px 12px !important;
    border-radius: 0 !important;
    font-size: 1rem !important;
  } */

  /* .ant-modal {
    border-radius: 10px;
    overflow: hidden;
  } */

  /* .ant-modal-header {
    text-align: center;
  } */

  /* .ant-modal-body {
    
  } */

  /* .ant-modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  } */

  /* .ant-modal-content {
    border-radius: 10px !important;
    overflow: hidden !important;
  } */
  
 /*  .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title {
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 1.05rem;
  } */

 /*  .ant-dropdown-menu-item-icon {
    font-size: 1.2rem;
    color: ${pallete.theme.primary};
  }
 */
  /* .ant-steps-item-process .ant-steps-item-icon {
    border-color: ${pallete.theme.primary};
  } */

  /* .ant-steps-item-finish .ant-steps-item-icon {
    border-color: ${pallete.theme.primary};
  } */

  /* .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-icon {
    background: ${pallete.theme.primary};
  } */

  /* .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
    color: ${pallete.theme.primary};
  } */

  /* .nav-drawer {
    .ant-btn {
      background-color: #ffffff;
      color: ${pallete.theme.bestGrey};
      box-shadow: 'none';
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: .7rem;
      letter-spacing: 1.3px;
      padding: 5px;
      width: 60px;
      height: auto;

      span{
        margin: 0;
      }
    }

    .anticon {
      font-size: 1.5rem;
    }
  } */

  /* @media (prefers-color-scheme: dark) {
    html {
      color-scheme: dark;
    }
    body {
      color: ${pallete.theme.highEmphasis};
      background: ${pallete.theme.pageBackgroundColorDark};
    }
  } */
`;

export default GlobalStyles;
