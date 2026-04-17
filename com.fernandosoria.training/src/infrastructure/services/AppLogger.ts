import { ILogger, LogLevel } from "../../domain/interfaces/ILogger";

export class AppLogger implements ILogger {
  log(level: LogLevel, message: string, data?: object): void {
    const logMessage = `[${level}]: ${message}`;
    console.log(logMessage, data);

    // In the future, this could be extended to send logs to a remote database
    // For example:
    // if (level === LogLevel.ERROR) {
    //   this.sendToRemoteDatabase({ level, message, data });
    // }
  }

  // private sendToRemoteDatabase(logData: object) {
  //   // Logic to send log data to a remote database
  // }
}
