import { Weight } from "../../valueObjects/Weight";
import { TonnageCalculatorService } from "../TonnageCalculator";
import { ILogger, LogLevel } from "../../interfaces/ILogger";

export class TonnageCalculatorServiceImpl implements TonnageCalculatorService {
  constructor(private readonly logger: ILogger) {}

  calculateTonnage(weight: Weight, reps: number, sets: number): number {
    this.logger.log(LogLevel.SUCCESS, "Calculating tonnage", { weight, reps, sets });
    if (reps < 0 || sets < 0 || weight.getValue(weight.getUnit()) < 0) {
      this.logger.log(LogLevel.ERROR, "Invalid input for tonnage calculation", { weight, reps, sets });
      throw new Error("Weight, reps, and sets cannot be negative");
    }
    const tonnage = weight.getValue(weight.getUnit()) * reps * sets;
    this.logger.log(LogLevel.SUCCESS, "Tonnage calculated successfully", { tonnage });
    return tonnage;
  }
}
