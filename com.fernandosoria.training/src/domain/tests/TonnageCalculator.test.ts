import { Weight } from "../valueObjects/Weight";
import { TonnageCalculatorServiceImpl } from "../services/implementations/TonnageCalculatorServiceImpl";
import { ILogger, LogLevel } from "../interfaces/ILogger";

class MockLogger implements ILogger {
  log(level: LogLevel, message: string, data?: object): void {}
}

describe("TonnageCalculatorService", () => {
  let tonnageCalculator: TonnageCalculatorServiceImpl;
  let logger: ILogger;

  beforeEach(() => {
    logger = new MockLogger();
    tonnageCalculator = new TonnageCalculatorServiceImpl(logger);
  });

  it("should calculate tonnage correctly for a single set", () => {
    const weight = Weight.fromKg(100);
    const reps = 5;
    const sets = 1;
    const expectedTonnage = 100 * 5 * 1;
    expect(tonnageCalculator.calculateTonnage(weight, reps, sets)).toBeCloseTo(expectedTonnage);
  });

  it("should calculate tonnage correctly for multiple sets", () => {
    const weight = Weight.fromKg(80);
    const reps = 8;
    const sets = 3;
    const expectedTonnage = 80 * 8 * 3;
    expect(tonnageCalculator.calculateTonnage(weight, reps, sets)).toBe(expectedTonnage);
  });

  it("should handle zero reps or sets", () => {
    const weight = Weight.fromKg(50);
    const reps = 0;
    const sets = 3;
    expect(tonnageCalculator.calculateTonnage(weight, reps, sets)).toBe(0);

    const weight2 = Weight.fromKg(50);
    const reps2 = 5;
    const sets2 = 0;
    expect(tonnageCalculator.calculateTonnage(weight2, reps2, sets2)).toBe(0);
  });

  it("should handle zero weight", () => {
    const weight = Weight.fromKg(0);
    const reps = 10;
    const sets = 3;
    expect(tonnageCalculator.calculateTonnage(weight, reps, sets)).toBe(0);
  });

  it("should calculate tonnage correctly when unit is lbs", () => {
    const weight = Weight.fromLbs(220.462);
    const reps = 5;
    const sets = 1;
    const expectedTonnage = 220.462 * 5 * 1;
    expect(tonnageCalculator.calculateTonnage(weight, reps, sets)).toBe(expectedTonnage);
  });
});
