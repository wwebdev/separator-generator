import React from 'react';
import { NextPageContext } from '../next-server/lib/utils';
export declare type ErrorProps = {
    statusCode: number;
    title?: string;
};
/**
 * `Error` component used for handling errors.
 */
export default class Error<P = {}> extends React.Component<P & ErrorProps> {
    static displayName: string;
    static getInitialProps({ res, err, }: NextPageContext): Promise<ErrorProps> | ErrorProps;
    render(): JSX.Element;
}
