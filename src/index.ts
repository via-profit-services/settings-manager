import { Winston } from '@via-profit-services/core';

export * from './schemas';

declare module '@via-profit-services/core' {
  interface ILoggerCollection {
    settings: Winston.Logger;
  }

  interface ILoggersConfig {
    settings: Winston.Logger;
  }
}
