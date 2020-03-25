import Head from 'next/head'
import styled from 'styled-components'

const Headline = styled.h1`
  color: red;
`

const Home = () => (
  <div className="container">
    <Head>
      <title>separator-generator</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main>
      <Headline>
        Welcome to your new project: separator-generator
      </Headline>
    </main>
  </div>
)

export default Home
