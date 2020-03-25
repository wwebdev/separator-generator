"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
/**
 * Utils
 */
function execOnce(fn) {
    let used = false;
    let result = null;
    return (...args) => {
        if (!used) {
            used = true;
            result = fn.apply(this, args);
        }
        return result;
    };
}
exports.execOnce = execOnce;
function getLocationOrigin() {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}
exports.getLocationOrigin = getLocationOrigin;
function getURL() {
    const { href } = window.location;
    const origin = getLocationOrigin();
    return href.substring(origin.length);
}
exports.getURL = getURL;
function getDisplayName(Component) {
    return typeof Component === 'string'
        ? Component
        : Component.displayName || Component.name || 'Unknown';
}
exports.getDisplayName = getDisplayName;
function isResSent(res) {
    return res.finished || res.headersSent;
}
exports.isResSent = isResSent;
async function loadGetInitialProps(App, ctx) {
    var _a;
    if (process.env.NODE_ENV !== 'production') {
        if ((_a = App.prototype) === null || _a === void 0 ? void 0 : _a.getInitialProps) {
            const message = `"${getDisplayName(App)}.getInitialProps()" is defined as an instance method - visit https://err.sh/zeit/next.js/get-initial-props-as-an-instance-method for more information.`;
            throw new Error(message);
        }
    }
    // when called from _app `ctx` is nested in `ctx`
    const res = ctx.res || (ctx.ctx && ctx.ctx.res);
    if (!App.getInitialProps) {
        if (ctx.ctx && ctx.Component) {
            // @ts-ignore pageProps default
            return {
                pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx),
            };
        }
        return {};
    }
    const props = await App.getInitialProps(ctx);
    if (res && isResSent(res)) {
        return props;
    }
    if (!props) {
        const message = `"${getDisplayName(App)}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
        throw new Error(message);
    }
    if (process.env.NODE_ENV !== 'production') {
        if (Object.keys(props).length === 0 && !ctx.ctx) {
            console.warn(`${getDisplayName(App)} returned an empty object from \`getInitialProps\`. This de-optimizes and prevents automatic static optimization. https://err.sh/zeit/next.js/empty-object-getInitialProps`);
        }
    }
    return props;
}
exports.loadGetInitialProps = loadGetInitialProps;
exports.urlObjectKeys = [
    'auth',
    'hash',
    'host',
    'hostname',
    'href',
    'path',
    'pathname',
    'port',
    'protocol',
    'query',
    'search',
    'slashes',
];
function formatWithValidation(url, options) {
    if (process.env.NODE_ENV === 'development') {
        if (url !== null && typeof url === 'object') {
            Object.keys(url).forEach(key => {
                if (exports.urlObjectKeys.indexOf(key) === -1) {
                    console.warn(`Unknown key passed via urlObject into url.format: ${key}`);
                }
            });
        }
    }
    return url_1.format(url, options);
}
exports.formatWithValidation = formatWithValidation;
exports.SP = typeof performance !== 'undefined';
exports.ST = exports.SP &&
    typeof performance.mark === 'function' &&
    typeof performance.measure === 'function';
