import { Set } from "../types";

export interface TonnageCalculatorService {
  calculateTonnage(sets: Set[]): number;
}
