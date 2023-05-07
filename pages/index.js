import { useSelector } from 'react-redux'
import HomeStyled from './home.styles'
import { Typography } from 'antd';

const { Text } = Typography;

export default function Home() {
  const view = useSelector(state => state.utilityReducer.view)

  return (
    <HomeStyled>
      {
        view === 'MOBILE' ?
        <div>
          <Text>HOME MOBILE</Text>
        </div>
        :
        <div>
          <Text>HOME DESKTOP</Text>
        </div>
      }
    </HomeStyled>
  )
}
