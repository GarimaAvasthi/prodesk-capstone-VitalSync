/**
 * Structured logging utility for the application
 * Provides consistent logging across all modules
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 100;

  /**
   * Format log level with color coding for console output
   */
  private formatLevel(level: LogLevel): string {
    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m', // Green
      warn: '\x1b[33m', // Yellow
      error: '\x1b[31m', // Red
    };
    const reset = '\x1b[0m';
    return `${colors[level]}[${level.toUpperCase()}]${reset}`;
  }

  /**
   * Create a logger instance for a specific module
   */
  public createModuleLogger(module: string) {
    return {
      debug: (message: string, data?: Record<string, unknown>) =>
        this.debug(message, module, data),
      info: (message: string, data?: Record<string, unknown>) =>
        this.info(message, module, data),
      warn: (message: string, data?: Record<string, unknown>) =>
        this.warn(message, module, data),
      error: (message: string, error?: Error | Record<string, unknown>, data?: Record<string, unknown>) =>
        this.error(message, module, error, data),
    };
  }

  /**
   * Log debug message
   */
  public debug(message: string, module: string = 'APP', data?: Record<string, unknown>) {
    if (this.isDevelopment) {
      console.debug(
        `${this.formatLevel('debug')} [${module}] ${message}`,
        data || ''
      );
    }
    this.storeLogEntry('debug', module, message, data);
  }

  /**
   * Log info message
   */
  public info(message: string, module: string = 'APP', data?: Record<string, unknown>) {
    console.log(
      `${this.formatLevel('info')} [${module}] ${message}`,
      data || ''
    );
    this.storeLogEntry('info', module, message, data);
  }

  /**
   * Log warning message
   */
  public warn(message: string, module: string = 'APP', data?: Record<string, unknown>) {
    console.warn(
      `${this.formatLevel('warn')} [${module}] ${message}`,
      data || ''
    );
    this.storeLogEntry('warn', module, message, data);
  }

  /**
   * Log error message
   */
  public error(
    message: string,
    module: string = 'APP',
    error?: Error | Record<string, unknown>,
    data?: Record<string, unknown>
  ) {
    const isError = error instanceof Error;
    console.error(
      `${this.formatLevel('error')} [${module}] ${message}`,
      isError ? error : error || '',
      data || ''
    );
    this.storeLogEntry(
      'error',
      module,
      message,
      data,
      isError ? error : undefined
    );
  }

  /**
   * Store log entry in history
   */
  private storeLogEntry(
    level: LogLevel,
    module: string,
    message: string,
    data?: Record<string, unknown>,
    error?: Error
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      data,
      error,
    };

    this.logHistory.push(entry);

    // Maintain max history size
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }

    // Send to remote logging service in production
    if (process.env.NODE_ENV === 'production' && level === 'error') {
      this.sendToRemoteLogger(entry);
    }
  }

  /**
   * Send error logs to remote logging service
   * (Implement integration with your logging service here)
   */
  private sendToRemoteLogger(entry: LogEntry) {
    // TODO: Integrate with logging service (Sentry, LogRocket, etc.)
    // Example:
    // captureException(entry.error || new Error(entry.message), {
    //   level: entry.level,
    //   tags: { module: entry.module },
    //   extra: entry.data,
    // });
  }

  /**
   * Get log history
   */
  public getHistory(level?: LogLevel): LogEntry[] {
    return level
      ? this.logHistory.filter((entry) => entry.level === level)
      : this.logHistory;
  }

  /**
   * Clear log history
   */
  public clearHistory() {
    this.logHistory = [];
  }

  /**
   * Export logs for debugging
   */
  public exportLogs(): string {
    return JSON.stringify(this.logHistory, null, 2);
  }

  /**
   * Log performance metrics
   */
  public logPerformance(
    moduleName: string,
    operation: string,
    duration: number,
    success: boolean = true
  ) {
    const message = `${operation} took ${duration}ms`;
    const data = { operation, duration, success };

    if (success) {
      this.info(message, moduleName, data);
    } else {
      this.warn(message, moduleName, data);
    }
  }

  /**
   * Measure operation execution time
   */
  public async measureAsync<T>(
    moduleName: string,
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.logPerformance(moduleName, operation, duration, true);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.logPerformance(moduleName, operation, duration, false);
      throw error;
    }
  }

  /**
   * Measure synchronous operation execution time
   */
  public measureSync<T>(
    moduleName: string,
    operation: string,
    fn: () => T
  ): T {
    const start = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - start;
      this.logPerformance(moduleName, operation, duration, true);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.logPerformance(moduleName, operation, duration, false);
      throw error;
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for use in modules
export type { LogEntry };
