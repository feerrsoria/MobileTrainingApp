import { Weight } from "../valueObjects/Weight";

export interface TonnageCalculatorService {
  calculateTonnage(weight: Weight, reps: number, sets: number): number;
}
