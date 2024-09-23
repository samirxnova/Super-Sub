import Head from 'next/head'
import { FC } from 'react'
import { Layout } from '~~/components/Layout'
import SubscriptionsPage from '~~/components/supscriptions/SubscriptionsPage'

const Page: FC = () => {
  return (
    <>
      <Head>
        <title>🥪 Home </title>
        <meta name="description" content="Home of your Supersubs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <SubscriptionsPage />
      </Layout>
    </>
  )
}

export default Page
