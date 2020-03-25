import webpack from 'webpack';
import { WebpackEntrypoints } from './entries';
export default function getBaseWebpackConfig(dir: string, { buildId, config, dev, isServer, pagesDir, tracer, target, entrypoints, }: {
    buildId: string;
    config: any;
    dev?: boolean;
    isServer?: boolean;
    pagesDir: string;
    target?: string;
    tracer?: any;
    entrypoints: WebpackEntrypoints;
}): Promise<webpack.Configuration>;
