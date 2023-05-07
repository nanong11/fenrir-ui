import GlobalStyles from '@/styles/globalStyle';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import Layout from '@/pages/layout';

function MyApp({ Component, pageProps }) {
  return <Provider store={store}>
            <GlobalStyles />
            <Layout>
              <Component {...pageProps} />
            </Layout>
         </Provider>
}

export default MyApp
