import { loader } from 'webpack';
import { PluginMetaData } from '../../plugins/collect-plugins';
export declare type NextPluginLoaderQuery = {
    middleware: string;
};
export declare const pluginLoaderOptions: {
    plugins: PluginMetaData[];
};
declare const nextPluginLoader: loader.Loader;
export default nextPluginLoader;
