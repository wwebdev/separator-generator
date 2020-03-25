"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const loadable_1 = __importDefault(require("./loadable"));
const isServerSide = typeof window === 'undefined';
function noSSR(LoadableInitializer, loadableOptions) {
    // Removing webpack and modules means react-loadable won't try preloading
    delete loadableOptions.webpack;
    delete loadableOptions.modules;
    // This check is neccesary to prevent react-loadable from initializing on the server
    if (!isServerSide) {
        return LoadableInitializer(loadableOptions);
    }
    const Loading = loadableOptions.loading;
    // This will only be rendered on the server side
    return () => (react_1.default.createElement(Loading, { error: null, isLoading: true, pastDelay: false, timedOut: false }));
}
exports.noSSR = noSSR;
// function dynamic<P = {}, O extends DynamicOptions>(options: O):
function dynamic(dynamicOptions, options) {
    let loadableFn = loadable_1.default;
    let loadableOptions = {
        // A loading component is not required, so we default it
        loading: ({ error, isLoading, pastDelay }) => {
            if (!pastDelay)
                return null;
            if (process.env.NODE_ENV === 'development') {
                if (isLoading) {
                    return null;
                }
                if (error) {
                    return (react_1.default.createElement("p", null,
                        error.message,
                        react_1.default.createElement("br", null),
                        error.stack));
                }
            }
            return null;
        },
    };
    // Support for direct import(), eg: dynamic(import('../hello-world'))
    // Note that this is only kept for the edge case where someone is passing in a promise as first argument
    // The react-loadable babel plugin will turn dynamic(import('../hello-world')) into dynamic(() => import('../hello-world'))
    // To make sure we don't execute the import without rendering first
    if (dynamicOptions instanceof Promise) {
        loadableOptions.loader = () => dynamicOptions;
        // Support for having import as a function, eg: dynamic(() => import('../hello-world'))
    }
    else if (typeof dynamicOptions === 'function') {
        loadableOptions.loader = dynamicOptions;
        // Support for having first argument being options, eg: dynamic({loader: import('../hello-world')})
    }
    else if (typeof dynamicOptions === 'object') {
        loadableOptions = Object.assign(Object.assign({}, loadableOptions), dynamicOptions);
    }
    // Support for passing options, eg: dynamic(import('../hello-world'), {loading: () => <p>Loading something</p>})
    loadableOptions = Object.assign(Object.assign({}, loadableOptions), options);
    if (typeof dynamicOptions === 'object' &&
        !(dynamicOptions instanceof Promise)) {
        // show deprecation warning for `modules` key in development
        if (process.env.NODE_ENV !== 'production') {
            if (dynamicOptions.modules) {
                console.warn('The modules option for next/dynamic has been deprecated. See here for more info https://err.sh/zeit/next.js/next-dynamic-modules');
            }
        }
        // Support for `render` when using a mapping, eg: `dynamic({ modules: () => {return {HelloWorld: import('../hello-world')}, render(props, loaded) {} } })
        if (dynamicOptions.render) {
            loadableOptions.render = (loaded, props) => dynamicOptions.render(props, loaded);
        }
        // Support for `modules` when using a mapping, eg: `dynamic({ modules: () => {return {HelloWorld: import('../hello-world')}, render(props, loaded) {} } })
        if (dynamicOptions.modules) {
            loadableFn = loadable_1.default.Map;
            const loadModules = {};
            const modules = dynamicOptions.modules();
            Object.keys(modules).forEach(key => {
                const value = modules[key];
                if (typeof value.then === 'function') {
                    loadModules[key] = () => value.then((mod) => mod.default || mod);
                    return;
                }
                loadModules[key] = value;
            });
            loadableOptions.loader = loadModules;
        }
    }
    // coming from build/babel/plugins/react-loadable-plugin.js
    if (loadableOptions.loadableGenerated) {
        loadableOptions = Object.assign(Object.assign({}, loadableOptions), loadableOptions.loadableGenerated);
        delete loadableOptions.loadableGenerated;
    }
    // support for disabling server side rendering, eg: dynamic(import('../hello-world'), {ssr: false})
    if (typeof loadableOptions.ssr === 'boolean') {
        if (!loadableOptions.ssr) {
            delete loadableOptions.ssr;
            return noSSR(loadableFn, loadableOptions);
        }
        delete loadableOptions.ssr;
    }
    return loadableFn(loadableOptions);
}
exports.default = dynamic;
