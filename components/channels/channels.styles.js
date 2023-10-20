import styled from 'styled-components';
// import * as pallete from '@/styles/variables';

const ChannelsStyled = styled.div`
	min-width: 100%;
	display: flex;
	justify-content: center;

	.channels-mobile-wrapper {
		width: 100%;
		min-height: 100vh;
		padding: 20px;
	}

	.channels-desktop-wrapper {
		width: 100%;
		/* min-height: 90vh; */
		display: flex;

		.channels-search-input {
			display: flex;
			/* margin: 0 0 16px 0; */

			.ant-input {
				border-radius: 6px !important;
				height: 30px;
				font-size: 1rem;
				background: ${props => props.colorprimarybg};
				transform: translate3d(0,0,0);
				padding: 10px 10px 10px 20px;
			}

			.ant-input:hover {
				border-color: ${props => props.colorprimary};
			}

			.ant-input:focus {
				border-color: ${props => props.colorprimary};
			}

			.ant-input-search > .ant-input-group > .ant-input-group-addon:last-child {
				left: 0 !important;
			}

			.ant-input-group-addon {
				width: 0;
			}

			.ant-input-search-button {
				z-index: 1;
				width: 26px;
				height: 26px;
				padding: 0;
				border-radius: 6px !important;
				margin-left: -30px;
			}
		}

		.link-btn {
			color: ${props => props.colorprimary};
			-webkit-user-select: none; /* Safari */
			-ms-user-select: none; /* IE 10 and IE 11 */
			user-select: none; /* Standard syntax */
		}

		.link-btn:hover{
			color: ${props => props.colorprimarybghover};
		}

		.ant-list-item-meta-title {
			margin: 0 !important;
		}
	}
`;

export default ChannelsStyled;
