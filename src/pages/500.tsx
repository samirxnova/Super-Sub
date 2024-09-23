import Head from 'next/head'
import { FC } from 'react'

const Page: FC = () => {
  return (
    <>
      <Head>
        <title>🥪 500 </title>
        <meta name="description" content="Home of your Supersubs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="space-y-8 text-xl pt-24">
        <div className="text-4xl font-bold tracking-widest">500</div>
      </div>
    </>
  )
}

export default Page
