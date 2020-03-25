/// <reference types="react" />
export default function ErrorDebug({ error, info, }: {
    error: Error;
    info: any;
}): JSX.Element;
export declare const styles: {
    errorDebug: {
        background: string;
        boxSizing: string;
        overflow: string;
        padding: string;
        position: string;
        left: number;
        right: number;
        top: number;
        bottom: number;
        zIndex: number;
        color: string;
    };
    stack: {
        fontFamily: string;
        fontSize: string;
        lineHeight: string;
        color: string;
        margin: number;
        whiteSpace: string;
        wordWrap: string;
        marginTop: string;
    };
    heading: {
        fontFamily: string;
        fontSize: string;
        fontWeight: string;
        lineHeight: string;
        color: string;
        marginBottom: string;
        marginTop: string;
    };
};
