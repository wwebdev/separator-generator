/**
 * MIT License
 *
 * Copyright (c) 2018 Prateek Bhatnagar
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/**
 * Webpack plugin for NextJs that runs a child compiler to generate a second (modern) JS bundle
 *
 * @author: Janicklas Ralph (https://github.com/janickals-ralph)
 *
 * Original source from which this was built upon - https://github.com/prateekbh/babel-esm-plugin
 */
import { Compiler, compilation, Plugin, RuleSetRule, RuleSetLoader } from 'webpack';
declare type BabelConfigItem = string | [string] | [string, any];
export default class NextEsmPlugin implements Plugin {
    options: {
        filename: any;
        chunkFilename: any;
        excludedPlugins: string[];
        additionalPlugins: Plugin[];
    };
    constructor(options: {
        filename: any;
        chunkFilename: any;
        excludedPlugins?: string[];
        additionalPlugins?: any;
    });
    apply(compiler: Compiler): void;
    getLoaders(rules: RuleSetRule[], predicate: (loader: string) => boolean): RuleSetLoader[];
    updateOptions(childCompiler: Compiler): void;
    ensureModernBabelOptions(options: {
        presets?: BabelConfigItem[];
        plugins?: BabelConfigItem[];
    }): void;
    updateAssets(compilation: compilation.Compilation, childCompilation: compilation.Compilation): void;
    runBuild(compiler: Compiler, compilation: compilation.Compilation): Promise<void>;
}
export {};
