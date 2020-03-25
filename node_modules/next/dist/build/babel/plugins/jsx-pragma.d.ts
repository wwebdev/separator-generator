import { PluginObj } from '@babel/core';
import * as BabelTypes from '@babel/types';
export default function ({ types: t, }: {
    types: typeof BabelTypes;
}): PluginObj<any>;
