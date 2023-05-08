import GlobalStyles from '@/styles/globalStyle';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import Layout from '@/pages/layout';
import { ConfigProvider, theme } from 'antd';
import * as pallete from '@/styles/variables';

function MyApp({ Component, pageProps }) {
  return <Provider store={store}>
            <GlobalStyles />
            <ConfigProvider
            theme={{
              token: {
                colorPrimary: pallete.theme.primary,
              },
              algorithm: theme.darkAlgorithm,
            }}
            >
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ConfigProvider>
         </Provider>
}

export default MyApp
