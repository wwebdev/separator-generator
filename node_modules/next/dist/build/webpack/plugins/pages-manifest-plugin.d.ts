import { Compiler, Plugin } from 'webpack';
export default class PagesManifestPlugin implements Plugin {
    serverless: boolean;
    constructor(serverless: boolean);
    apply(compiler: Compiler): void;
}
