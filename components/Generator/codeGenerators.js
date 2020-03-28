import { SEPARATORS } from './constants'
import { darkGrey } from '../../ui/constants'

export const generateHtmlCode = active => [SEPARATORS.SKEWED, SEPARATORS.WAVE].includes(active)
? `<section>
  <div class="${active}"></div>
</section>`
: `<section class="${active}"></section>`

export const generateCssCode = ({ active, options }) => {
  // TODO check what to generate
  return `.${active} {
  ${generateSkewCss(options)}
}`
}

export const generateSkewCss = ({ angle, reversed }) =>
`position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${darkGrey};
  z-index: 0;
  ${!reversed
  ? `transform: skewY(${angle.value}deg);
  transform-origin: top right;`
  : `transform: skewY(-${angle.value}deg);
  transform-origin: top left;`}`