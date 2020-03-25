import React from 'react';
declare type State = Array<React.ReactElement<any>> | undefined;
declare type SideEffectProps = {
    reduceComponentsToState: <T>(components: Array<React.ReactElement<any>>, props: T) => State;
    handleStateChange?: (state: State) => void;
    inAmpMode?: boolean;
};
declare const _default: () => {
    new (props: any): {
        componentDidMount(): void;
        componentDidUpdate(): void;
        componentWillUnmount(): void;
        render(): null;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<SideEffectProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<SideEffectProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<SideEffectProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<SideEffectProps>, prevState: Readonly<{}>): any;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<SideEffectProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<SideEffectProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<SideEffectProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<SideEffectProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    rewind(): State;
    contextType?: React.Context<any> | undefined;
};
export default _default;
