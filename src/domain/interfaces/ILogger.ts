export enum LogLevel {
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

export interface ILogger {
  log(level: LogLevel, message: string, data?: object): void;
}
