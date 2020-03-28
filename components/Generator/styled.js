import styled, { css } from 'styled-components'
import _get from 'lodash/get'
import {
  Card,
  TextareaAutosize,
  FormControlLabel as MuiFormControlLabel
} from '@material-ui/core'
import { darkGrey } from '../../ui/constants'
import { generateSkewCss } from './codeGenerators'

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

  &.skewed {
    background: transparent;
  }
`

export const Curved = styled(Top)`
  border-bottom-left-radius: 50% ${props => _get(props, 'options.curve.value')}%;
  border-bottom-right-radius: 50% ${props => _get(props, 'options.curve.value')}%;

  &.reverse {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    &::after {
      content: '';
      border-top-left-radius: 50% ${props => 100 - _get(props, 'options.curve.value') || 0}%; /* TODO fix */
      border-top-right-radius: 50% ${props => 100 - _get(props, 'options.curve.value') || 0}%;
      position: absolute;
      bottom: 0;
      width: 100%;
      background: #fff;
      height: 50px;
    }
  }
`

export const Spikes = styled(Top)`
  &::after {
    content: '';
    position: absolute;
    right: 0;
    left: 0;
    top: 100%;
    z-index: 10;
    display: block;
    height: ${props => _get(props, 'options.size.value')}px;
    background-size: ${props => _get(props, 'options.size.value')}px 100%;
    background-image: linear-gradient(135deg, ${darkGrey} 25%, transparent 25%), linear-gradient(225deg, ${darkGrey} 25%, transparent 25%);
    background-position: ${props => _get(props, 'options.left.value')}%;
  }
`

export const Triangle = styled(Top)`
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    z-index: 10;
    background: inherit;
    left: ${props => _get(props, 'options.left.value')}%;
    width: ${props => _get(props, 'options.size.value')}px;
    height: ${props => _get(props, 'options.size.value')}px;
    transform:
      translateX(-50%)
      translateY(50%)
      rotate(45deg);
  }

  &.reverse::before {
    background: #fff;
  }
`

export const SemiCircle = styled(Top)`
  &::before {
    position: absolute;
    content: '';
    left: ${props => _get(props, 'options.left.value')}%;
    z-index: 10;
    width: ${props => _get(props, 'options.width.value')}px;
    height: ${props => _get(props, 'options.height.value')}px;
    border-radius: 50%;
    background: inherit;
    transform: translateX(-50%) translateY(${props => _get(props, 'options.top.value')}%);
    bottom: 0px;
  }

  &.reverse::before {
    background: #fff;
    transform:
      translateX(-50%)
      translateY(${props => (_get(props, 'options.top.value') || 0) * -1 + 100}%);
  }
`

export const SkewBg = styled.div`
  ${props => generateSkewCss(props.options)}
`

export const Wave = styled.div`
  position: absolute;
  height: ${props => props.curve}px;
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
    height: 110%;
    background-color: #fff;
    right: 0;
    top: 60%;
  }
  &::after {
    width: 53.5%;
    height: 100%;
    background-color: ${darkGrey};
    left: 0;
    top: 40%;
  }

  &.reverse::before,
  &.reverse::after {
    border-radius: 50% 100%;
  }

  &.reverse::before {
    height: 100%;
    top: 40%;
    background-color: ${darkGrey};
  }

  &.reverse::after {
    height: 110%;
    top: 60%;
    background-color: #fff;
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