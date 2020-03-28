import React from 'react'
import { Paper, Tabs, Tab, Slider, Checkbox } from '@material-ui/core'
import * as S from './styled'

const Controls = props => {
    const { setOptions, options } = props
    const [value, setValue] = React.useState(0)

    const handleCheck = e => {
        setOptions({ ...options, [e.target.name]: e.target.checked });
    }

    const handleChange = (key, newVal) => {
        setOptions({ ...options, [key]: {
            ...options[key],
            value: newVal,
        } });
    }

    return (
        <S.Controls>
            <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={(event, newValue) => { setValue(newValue) }}
                aria-label="controls for customizing the separator"
            >
                <Tab label="Settings" />
                <Tab label="HTML" />
                <Tab label="CSS" />
            </Tabs>
            <S.ControlContent>
                { value === 0 &&
                    <div>
                        { options.reversed !== undefined &&
                            <S.FormControlLabel
                                label="Reversed"
                                control={
                                    <Checkbox
                                        checked={options.reversed}
                                        onChange={handleCheck}
                                        name="reversed"
                                        color="primary"
                                    />
                                }
                            />
                        }
                        { Object.entries(options).map(([key, option]) =>
                            key !== 'reversed' && <S.SliderContainer key={`${key}-slider`}>
                                <label>{key}</label>
                                <Slider
                                    value={option.value}
                                    onChange={(e, newVal) => handleChange(key, newVal)}
                                    aria-labelledby={`${key}-slider`}
                                    min={option.min}
                                    max={option.max}
                                />
                            </S.SliderContainer>
                        )}
                    </div>
                }
                { value === 1 &&
                    <div>
                        THE HTML
                    </div>
                }
                { value === 2 &&
                    <div>
                        THE CSS
                    </div>
                }
                { /* TODO hide (arrow up) button on mobile */ }
            </S.ControlContent>
        </S.Controls>
    )
}

export default Controls
