import styled, { css } from 'styled-components'
import {
  Card,
  TextareaAutosize,
  FormControlLabel as MuiFormControlLabel
} from '@material-ui/core'
import { darkGrey } from '../../ui/constants'
import {
  generateSkewCss,
  generateSemiCircleCss,
  generateWaveCss,
  generateSpikesCss,
  generateTriangleCss,
  generateCurvedCss,
} from './codeGenerators'

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
  background: ${props => props.noBgColor ? 'transparent' : darkGrey};
`

export const SkewBg = styled.div`
  ${props => generateSkewCss(props.options)}
`

export const SemiCircle = styled(Top)`
  ${props => generateSemiCircleCss(props.options)}
`

export const Wave = styled.div`
  ${props => generateWaveCss(props.options)}
`

export const Spikes = styled(Top)`
  ${props => generateSpikesCss(props.options)}
`

export const Triangle = styled(Top)`
  ${props => generateTriangleCss(props.options)}
`

export const Curved = styled(Top)`
  ${props => generateCurvedCss(props.options)}
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

    &.active,
    &:hover {
      cursor: pointer;
      box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }
  }

  img {
    width: 100%;
  }
`

export const Controls = styled(Card)`
  position: relative;
  background-color: rgba(255,255,255,0.7) !important;
  z-index: 20;

  @media (max-height: 900px) {
    position: absolute;
    top: 100px;
  }
`

export const ControlContent = styled.div`
  padding: 10px;
  display: ${props => props.isVisible ? 'block' : 'none'};
`

export const ControlToggle = styled.div`
  @media (min-height: 899px) {
    display: none;
  }

  padding: 10px;
  border-top: 1px solid rgba(0,0,0,0.23);
  cursor: pointer;

  > span {
    color: rgba(0, 0, 0, 0.54);
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

export const FormControlLabel = styled(MuiFormControlLabel)`
  margin-bottom: 10px;
`

export const SliderContainer = styled.div`
  label {
    text-transform: capitalize;
    color: ${darkGrey};
  }
`
export const CodeArea = styled(TextareaAutosize)`
    width: 100%;
    margin-bottom: ${props => props.marginBottom ? '20px' : '0'};
`

export const CopyContainer = styled.div`
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  svg {
    color: ${darkGrey};
    margin-right: 4px;
  }
`

export const Copied = styled.span`
    display: inline-block;
    padding: 4px;
    margin-right: 5px;
    background: rgba(0,0,0,0.8);
    color: rgba(255,255,255,0.6);
    border-radius: 5px;
    opacity: 0;
    transition: opacity 0.3s;

    ${props => props.visible && css`
        opacity: 1;
    `}
`