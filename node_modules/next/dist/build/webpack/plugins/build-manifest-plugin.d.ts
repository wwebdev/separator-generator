import { Compiler } from 'webpack';
export default class BuildManifestPlugin {
    private buildId;
    private clientManifest;
    private modern;
    constructor(options: {
        buildId: string;
        clientManifest: boolean;
        modern: boolean;
    });
    apply(compiler: Compiler): void;
}
