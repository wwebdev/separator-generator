/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
export default function onDemandEntryHandler(devMiddleware: WebpackDevMiddleware.WebpackDevMiddleware, multiCompiler: webpack.MultiCompiler, { buildId, pagesDir, reload, pageExtensions, maxInactiveAge, pagesBufferLength, }: {
    buildId: string;
    pagesDir: string;
    reload: any;
    pageExtensions: string[];
    maxInactiveAge: number;
    pagesBufferLength: number;
}): {
    waitUntilReloaded(): Promise<unknown>;
    ensurePage(page: string): Promise<unknown>;
    middleware(): (req: IncomingMessage, res: ServerResponse, next: Function) => any;
};
export declare function normalizePage(page: string): string;
