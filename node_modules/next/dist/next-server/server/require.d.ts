export declare function pageNotFoundError(page: string): Error;
export declare function getPagePath(page: string, distDir: string, serverless: boolean, dev?: boolean): string;
export declare function requirePage(page: string, distDir: string, serverless: boolean): any;
