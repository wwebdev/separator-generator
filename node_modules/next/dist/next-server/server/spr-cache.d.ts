declare type SprCacheValue = {
    html: string;
    pageData: any;
    isStale?: boolean;
    curRevalidate?: number | false;
    revalidateAfter: number | false;
};
export declare const calculateRevalidate: (pathname: string) => number | false;
export declare function initializeSprCache({ max, dev, distDir, pagesDir, flushToDisk, }: {
    dev: boolean;
    max?: number;
    distDir: string;
    pagesDir: string;
    flushToDisk?: boolean;
}): void;
export declare function getFallback(page: string): Promise<string>;
export declare function getSprCache(pathname: string): Promise<SprCacheValue | undefined>;
export declare function setSprCache(pathname: string, data: {
    html: string;
    pageData: any;
}, revalidateSeconds?: number | false): Promise<void>;
export {};
