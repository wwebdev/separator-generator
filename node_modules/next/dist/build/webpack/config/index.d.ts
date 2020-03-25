import webpack from 'webpack';
export declare function build(config: webpack.Configuration, { rootDirectory, customAppFile, isDevelopment, isServer, hasSupportCss, hasSupportScss, assetPrefix, }: {
    rootDirectory: string;
    customAppFile: string | null;
    isDevelopment: boolean;
    isServer: boolean;
    hasSupportCss: boolean;
    hasSupportScss: boolean;
    assetPrefix: string;
}): Promise<webpack.Configuration>;
