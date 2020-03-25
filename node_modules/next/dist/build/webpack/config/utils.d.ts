import webpack from 'webpack';
export declare type ConfigurationContext = {
    rootDirectory: string;
    customAppFile: string | null;
    isDevelopment: boolean;
    isProduction: boolean;
    isServer: boolean;
    isClient: boolean;
    assetPrefix: string;
};
export declare type ConfigurationFn = (a: webpack.Configuration) => webpack.Configuration;
export declare const pipe: <R>(...fns: ((a: R) => R | Promise<R>)[]) => (param: R) => R | Promise<R>;
