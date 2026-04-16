import { Set } from "../types";
import { TonnageCalculatorServiceImpl } from "../services/implementations/TonnageCalculatorServiceImpl";

describe("TonnageCalculatorService", () => {
  let tonnageCalculatorService: TonnageCalculatorServiceImpl;

  beforeEach(() => {
    tonnageCalculatorService = new TonnageCalculatorServiceImpl();
  });

  it("should calculate tonnage correctly for sets with weight", () => {
    const sets: Set[] = [
      { repetitions: 10, weight: 50, sets: 3 },
      { repetitions: 8, weight: 60, sets: 4 },
    ];

    const expectedTonnage = (50 * 10 * 3) + (60 * 8 * 4); // 1500 + 1920 = 3420
    const actualTonnage = tonnageCalculatorService.calculateTonnage(sets);

    expect(actualTonnage).toBe(expectedTonnage);
  });

  it("should return 0 tonnage for sets without weight (RPE only)", () => {
    const sets: Set[] = [
      { repetitions: 10, sets: 3, rpe: 8, repsFailed: 0 },
      { repetitions: 8, sets: 4, rpe: 9, repsFailed: 1 },
    ];

    const expectedTonnage = 0;
    const actualTonnage = tonnageCalculatorService.calculateTonnage(sets);

    expect(actualTonnage).toBe(expectedTonnage);
  });

  it("should calculate tonnage for a mix of sets with and without weight", () => {
    const sets: Set[] = [
      { repetitions: 10, weight: 50, sets: 3 },
      { repetitions: 8, sets: 4, rpe: 9, repsFailed: 1 },
      { repetitions: 5, weight: 100, sets: 2 },
    ];

    const expectedTonnage = (50 * 10 * 3) + (100 * 5 * 2); // 1500 + 1000 = 2500
    const actualTonnage = tonnageCalculatorService.calculateTonnage(sets);

    expect(actualTonnage).toBe(expectedTonnage);
  });

  it("should return 0 for an empty array of sets", () => {
    const sets: Set[] = [];

    const expectedTonnage = 0;
    const actualTonnage = tonnageCalculatorService.calculateTonnage(sets);

    expect(actualTonnage).toBe(expectedTonnage);
  });
});
