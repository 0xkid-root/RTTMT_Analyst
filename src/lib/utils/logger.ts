export const logger = {
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[RTMT Debug]', ...args);
    }
  },
  info: (...args: any[]) => {
    console.info('[RTMT Info]', ...args);
  },
  warn: (...args: any[]) => {
    console.warn('[RTMT Warn]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[RTMT Error]', ...args);
  }
};
