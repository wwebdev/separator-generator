import { Compiler, Plugin } from 'webpack';
export declare class NextJsRequireCacheHotReloader implements Plugin {
    prevAssets: any;
    apply(compiler: Compiler): void;
}
