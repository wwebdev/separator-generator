import { Compiler, Plugin } from 'webpack';
export declare class DropClientPage implements Plugin {
    ampPages: Set<unknown>;
    apply(compiler: Compiler): void;
}
