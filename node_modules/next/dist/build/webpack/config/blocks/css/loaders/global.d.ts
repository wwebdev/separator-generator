import postcss from 'postcss';
import webpack from 'webpack';
import { ConfigurationContext } from '../../../utils';
export declare function getGlobalCssLoader(ctx: ConfigurationContext, postCssPlugins: readonly postcss.AcceptedPlugin[], preProcessors?: readonly webpack.RuleSetUseItem[]): webpack.RuleSetUseItem[];
