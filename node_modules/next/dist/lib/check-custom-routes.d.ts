export declare type Rewrite = {
    source: string;
    destination: string;
};
export declare type Redirect = Rewrite & {
    statusCode?: number;
    permanent?: boolean;
};
export declare type Header = {
    source: string;
    headers: Array<{
        key: string;
        value: string;
    }>;
};
export declare function getRedirectStatus(route: Redirect): number;
export declare type RouteType = 'rewrite' | 'redirect' | 'header';
export default function checkCustomRoutes(routes: Redirect[] | Header[] | Rewrite[], type: RouteType): void;
