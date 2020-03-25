import Head from 'next/head'
import styled from 'styled-components'
import { Generator } from '../components'

const Home = () => (
  <div className="container">
    <Head>
      <title>Separator Generator</title>
      <link rel="icon" href="/favicon.ico" />
      <style>
        {'body { margin: 0; font-family: sans-serif }'}
      </style>
    </Head>

    <Generator />
  </div>
)

export default Home
