import { loader } from 'webpack';
export declare type ServerlessLoaderQuery = {
    page: string;
    distDir: string;
    absolutePagePath: string;
    absoluteAppPath: string;
    absoluteDocumentPath: string;
    absoluteErrorPath: string;
    buildId: string;
    assetPrefix: string;
    generateEtags: string;
    canonicalBase: string;
    basePath: string;
    runtimeConfig: string;
    previewProps: string;
};
declare const nextServerlessLoader: loader.Loader;
export default nextServerlessLoader;
