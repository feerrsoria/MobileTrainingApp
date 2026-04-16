import { Set } from "../../types"; // Import Set from types
import { TonnageCalculatorService } from "../TonnageCalculator";

export class TonnageCalculatorServiceImpl implements TonnageCalculatorService {
  calculateTonnage(sets: Set[]): number {
    let totalTonnage = 0;
    for (const s of sets) {
      if (s.weight !== undefined) {
        totalTonnage += s.weight * s.repetitions * s.sets;
      }
    }
    return totalTonnage;
  }
}
