import webpack from 'webpack';
export declare type CompilerResult = {
    errors: Error[];
    warnings: Error[];
};
export declare function runCompiler(config: webpack.Configuration | webpack.Configuration[]): Promise<CompilerResult>;
