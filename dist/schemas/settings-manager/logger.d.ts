import 'winston-daily-rotate-file';
export declare const configureSettingsLogger: (config: Config) => import("winston").Logger;
interface Config {
    logDir: string;
    logFilenamePattern?: string;
}
export default configureSettingsLogger;
