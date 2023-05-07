import styled from "styled-components";
import * as pallete from '@/styles/variables';

const FooterStyled = styled.div`
    width: 100%;
    min-height: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
    background: ${pallete.theme.lightGrey};
`;

export default FooterStyled;
