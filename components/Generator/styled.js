import styled from 'styled-components'
import { darkGrey } from '../../ui/constants'

export const Container = styled.main`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const Section = styled.section`
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`
export const Top = styled(Section)`
  background: ${darkGrey};
  color: #fff;

  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    background: #fff;
    height: 20%; /* TODO calculate */
    transform: skewY(6deg); /* TODO calculate */
    transform-origin: top left; /* or top right (+ skewY = -) */
  }
`
export const Bottom = styled(Section)`
  color: ${darkGrey};
`