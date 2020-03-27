import React, { useState } from 'react'
import { Card } from '@material-ui/core'
import { GitHub } from '@material-ui/icons'
import * as S from './styled'

const Generator = props => {
    const [active, setActive] = useState('triangle')
    const [reversed, setReversed] = useState('false')

    // /*  todo reverse */
    return (
        <React.Fragment>
            <S.Header>
                <a href='https://wweb.dev' target="_blank" rel="noopener noreferrer">
                    <img src="https://res.cloudinary.com/wwebdev/image/upload/v1585149959/logo-text_rhuhcl.png" alt="Logo of wweb.dev"/>
                </a>
                <a href='https://github.com/Vincenius/separator-generator' target="_blank" rel="noopener noreferrer">
                    <GitHub />
                </a>
            </S.Header>
            <S.Container>
                <S.Top className={active}>

                    { active === 'skewed' && <S.SkewBg></S.SkewBg> }
                    { active === 'wave' && <S.Wave></S.Wave> }
                </S.Top>
                <S.Center>
                    TODO Show Code
                </S.Center>
                <S.Bottom>
                    <S.Row>
                        <Card onClick={() => { setActive('skewed') }}><img src="/skewed.png" alt="skewed" /></Card>
                        <Card onClick={() => { setActive('semiCircle') }}><img src="/semicircle.png" alt="semi circle" /></Card>
                        <Card onClick={() => { setActive('wave') }}><img src="/wave.png" alt="wave" /></Card>
                    </S.Row>
                    <S.Row>
                        <Card onClick={() => { setActive('spikes') }}><img src="/spikes.png" alt="spikes" /></Card>
                        <Card onClick={() => { setActive('triangle') }}><img src="/triangle.png" alt="triangle" /></Card>
                        <Card onClick={() => { setActive('curved') }}><img src="/curved.png" alt="curved" /></Card>
                    </S.Row>
                </S.Bottom>
            </S.Container>
        </React.Fragment>
    )
}

export default Generator
