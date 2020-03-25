import { MinifyOptions } from 'terser';
declare const minify: (options: {
    file: string;
    input: string;
    inputSourceMap?: string | undefined;
    terserOptions?: MinifyOptions | undefined;
}) => {
    error: Error | undefined;
    map: string | import("source-map").RawSourceMap | undefined;
    code: string | undefined;
    warnings: string[] | undefined;
};
export default minify;
