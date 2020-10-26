import { Winston } from '@via-profit-services/core';
export declare const configureSettingsLogger: (config: Config) => Winston.Logger;
interface Config {
    logDir: string;
    logFilenamePattern?: string;
}
export default configureSettingsLogger;
