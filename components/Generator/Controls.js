import React from 'react'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import * as S from './styled'

const Controls = props => {
    const [value, setValue] = React.useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
        <S.Controls square>
            <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                aria-label="controls for customizing the separator"
            >
                <Tab label="Settings" />
                <Tab label="HTML" />
                <Tab label="CSS" />
            </Tabs>
            <S.ControlContent>
                TODO content {value}
            </S.ControlContent>
        </S.Controls>
    )
}

export default Controls
