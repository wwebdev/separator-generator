export declare type BuildManifest = {
    devFiles: string[];
    pages: {
        [page: string]: string[];
    };
};
export declare function getPageFiles(buildManifest: BuildManifest, page: string): string[];
