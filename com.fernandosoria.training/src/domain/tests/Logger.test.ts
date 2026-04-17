import { ILogger, LogLevel } from "../interfaces/ILogger";
import { AppLogger } from "../../infrastructure/services/AppLogger";

describe("AppLogger", () => {
  let logger: ILogger;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new AppLogger();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it("should log a success message to the console", () => {
    const message = "Operation successful";
    const data = { userId: "123" };
    logger.log(LogLevel.SUCCESS, message, data);
    expect(consoleLogSpy).toHaveBeenCalledWith("[SUCCESS]: Operation successful", { userId: "123" });
  });

  it("should log a warning message to the console", () => {
    const message = "Operation has warnings";
    logger.log(LogLevel.WARNING, message);
    expect(consoleLogSpy).toHaveBeenCalledWith("[WARNING]: Operation has warnings", undefined);
  });

  it("should log an error message to the console", () => {
    const message = "Operation failed";
    const error = new Error("Something went wrong");
    logger.log(LogLevel.ERROR, message, { error });
    expect(consoleLogSpy).toHaveBeenCalledWith("[ERROR]: Operation failed", { error });
  });
});
