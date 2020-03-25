export declare function normalizeConfig(phase: string, config: any): any;
export default function loadConfig(phase: string, dir: string, customConfig?: object | null): {
    [key: string]: any;
};
export declare function isTargetLikeServerless(target: string): boolean;
