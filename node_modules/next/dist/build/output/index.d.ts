export declare function startedDevelopmentServer(appUrl: string): void;
declare type CompilerDiagnostics = {
    errors: string[] | null;
    warnings: string[] | null;
};
declare type AmpStatus = {
    message: string;
    line: number;
    col: number;
    specUrl: string | null;
    code: string;
};
export declare type AmpPageStatus = {
    [page: string]: {
        errors: AmpStatus[];
        warnings: AmpStatus[];
    };
};
export declare function formatAmpMessages(amp: AmpPageStatus): string;
export declare function ampValidation(page: string, errors: AmpStatus[], warnings: AmpStatus[]): void;
export declare function watchCompilers(client: any, server: any, enableTypeCheckingOnClient: boolean, onTypeChecked: (diagnostics: CompilerDiagnostics) => void): void;
export {};
