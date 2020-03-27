import styled from 'styled-components'
import { darkGrey } from '../../ui/constants'
import { Card } from '@material-ui/core'

export const Container = styled.main`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

export const Header = styled.header`
  position: absolute;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;

  a {
    color: #fff;
  }

  img {
    height: 50px;
    margin-left: 3px;
  }

  svg {
    font-size: 32px;
  }
`

const Section = styled.section`
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Top = styled(Section)`
  color: #fff;
  background: ${darkGrey};

  &.curved {
    border-bottom-left-radius: 50% 20%;
    border-bottom-right-radius: 50% 20%;
  }

  &.spikes {
    &::after {
      content: '';
      position: absolute;
      right: 0;
      left: 0;
      top: 100%;
      z-index: 10;
      display: block;
      height: 90px;
      background-size: 50px 100%;
      background-image: linear-gradient(135deg, ${darkGrey} 25%, transparent 25%), linear-gradient(225deg, ${darkGrey} 25%, transparent 25%);
      background-position: 50%;
    }
  }

  &.triangle::before {
    content: '';
    position: absolute;
    bottom: -50px;
    z-index: 10;
    background: inherit;
    left: 50%;
    width: 100px;
    height: 100px;
    transform: translateX(-50%) rotate(45deg);
  }

  &.triangle.reverse::before {
    bottom: 0;
    transform: translateX(-50%) translateY(50%) rotate(45deg);
    background: #fff;
  }

  &.semiCircle::before {
    position: absolute;
    content: '';
    left: 50%;
    z-index: 10;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: inherit;
    transform: translateX(-50%);
    bottom: -50px;
  }

  &.semiCircle.reverse::before {
    bottom: -50px;
    background: #fff;
  }

  &.skewed {
    background: transparent;
  }
`

export const SkewBg = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${darkGrey};
  transform: skewY(6deg);
  transform-origin: top right;
  z-index: 0;
`

export const Wave = styled.div`
  position: absolute;
  height: 70px;
  width: 100%;
  background: ${darkGrey};
  bottom: 0;

  &::before, &::after {
    content: "";
    display: block;
    position: absolute;
    border-radius: 100% 50%;
  }

  &::before {
    width: 53.5%;
    height: 80px;
    background-color: #fff;
    right: 0;
    top: 40px;
  }
  &::after {
    width: 53.5%;
    height: 70px;
    background-color: ${darkGrey};
    left: -1px;
    top: 27px;
  }
`

export const Bottom = styled(Section)`
  color: ${darkGrey};
  display: flex;
  align-items: flex-end;
`

export const Row = styled.div`
  display: flex;

  > * {
    margin: 20px;

    @media (max-width: 768px) {
      margin: 5px;
    }

    &:hover {
      cursor: pointer;
      box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }
  }

  img {
    width: 100%;
  }
`

export const Controls = styled(Card)`
  position: relative;
  z-index: 20;
`

export const ControlContent = styled.div`
  padding: 10px;
`