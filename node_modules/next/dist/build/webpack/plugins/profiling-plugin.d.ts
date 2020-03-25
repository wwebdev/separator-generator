export declare class ProfilingPlugin {
    tracer: any;
    /**
     * @param {ProfilingPluginOptions=} opts options object
     */
    constructor(opts: {
        tracer: any;
    });
    apply(compiler: any): void;
}
