import { PHASE_DEVELOPMENT_SERVER, PHASE_EXPORT, PHASE_PRODUCTION_BUILD } from '../../next-server/lib/constants';
declare type EventCliSessionStarted = {
    nextVersion: string;
    nodeVersion: string;
    cliCommand: string;
    isSrcDir: boolean | null;
    hasNowJson: boolean;
    isCustomServer: boolean | null;
    hasNextConfig: boolean;
    buildTarget: string;
    hasWebpackConfig: boolean;
    hasBabelConfig: boolean;
};
declare type NextConfigurationPhase = typeof PHASE_DEVELOPMENT_SERVER | typeof PHASE_PRODUCTION_BUILD | typeof PHASE_EXPORT;
export declare function eventCliSession(phase: NextConfigurationPhase, dir: string, event: Omit<EventCliSessionStarted, 'nextVersion' | 'nodeVersion' | 'hasNextConfig' | 'buildTarget' | 'hasWebpackConfig' | 'hasBabelConfig'>): {
    eventName: string;
    payload: EventCliSessionStarted;
}[];
export {};
