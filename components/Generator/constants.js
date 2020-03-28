export const SEPARATORS = {
    SKEWED: 'skewed',
    SEMI_CIRCLE: 'semiCircle',
    WAVE: 'wave',
    SPIKES: 'spikes',
    TRIANGLE: 'triangle',
    CURVED: 'curved',
}

export const SEPARATOR_OPTIONS = {
    [SEPARATORS.SKEWED]: {
        reversed: false,
        angle: {
            value: 6,
            min: 0,
            max: 90,
        },
    },
    [SEPARATORS.SEMI_CIRCLE]: {
        reversed: false,
        width: {
            value: 100,
            min: 10,
            max: 1000,
        },
        height: {
            value: 100,
            min: 10,
            max: 1000,
        },
        left: {
            value: 50,
            min: 0,
            max: 100,
        },
        top: {
            value: 50,
            min: 0,
            max: 50,
        },
    },
    [SEPARATORS.WAVE]: {
        reversed: false,
        curve: 10, // ??
    },
    [SEPARATORS.SPIKES]: {
        height: 20,
        width: 20,
        left: 0,
    },
    [SEPARATORS.TRIANGLE]: {
        reversed: false,
        size: {
            value: 100,
            min: 10,
            max: 1000,
        },
        left: {
            value: 50,
            min: 0,
            max: 100,
        },
        top: {
            value: 50,
            min: 0,
            max: 50,
        },
    },
    [SEPARATORS.CURVED]: {
        reversed: false,
        curve: {
            value: 20,
            min: 0,
            max: 100,
        },
    }
}
