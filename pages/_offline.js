import Head from 'next/head'

const Fallback = () => (
  <>
    <Head>
      <title>Fenrir</title>
    </Head>
    <h1>No internet connect.</h1>
    <h2>Please connect to internet to continue using this app.</h2>
  </>
)

export default Fallback
