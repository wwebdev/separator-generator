import React, { useState } from 'react'
import * as S from './styled'

const Generator = props => {
    const [active, setActive] = useState('skewed')
    const [reversed, setReversed] = useState('false')

    // /*  className="elliptical" className="triangles" className="semiCircle reverse" */
    return (
        <S.Container>
            <S.Top className={['skewed', 'wave'].includes(active) ? '' : active}>

                { active === 'skewed' && <S.SkewBg></S.SkewBg> }
                { active === 'wave' && <S.Wave></S.Wave> }
            </S.Top>
            <S.Bottom>
            </S.Bottom>
        </S.Container>
    )
}

export default Generator
