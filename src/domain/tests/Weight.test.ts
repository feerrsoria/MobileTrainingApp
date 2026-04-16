import { Weight } from "../valueObjects/Weight";
import { UserConfig } from "../types";

describe("Weight ValueObject", () => {
  it("should create a Weight object from kilograms", () => {
    const weightKg = Weight.fromKg(100);
    expect(weightKg.getUnit()).toBe("kg");
    expect(weightKg.getValue("kg")).toBe(100);
  });

  it("should create a Weight object from pounds", () => {
    const weightLbs = Weight.fromLbs(220.462);
    expect(weightLbs.getUnit()).toBe("lbs");
    expect(weightLbs.getValue("lbs")).toBeCloseTo(220.462);
  });

  it("should convert kilograms to pounds correctly", () => {
    const weightKg = Weight.fromKg(100);
    expect(weightKg.toLbs()).toBeCloseTo(220.462); // 100 kg * 2.20462 = 220.462 lbs
  });

  it("should convert pounds to kilograms correctly", () => {
    const weightLbs = Weight.fromLbs(220.462);
    expect(weightLbs.toKg()).toBeCloseTo(100); // 220.462 lbs * 0.453592 = 100 kg
  });

  it("should compare two Weight objects correctly", () => {
    const weight100Kg = Weight.fromKg(100);
    const weight220Lbs = Weight.fromLbs(220.462);
    const weight90Kg = Weight.fromKg(90);

    expect(weight100Kg.equals(weight220Lbs)).toBe(true);
    expect(weight100Kg.equals(weight90Kg)).toBe(false);
  });

  it("should throw an error for negative weight", () => {
    expect(() => Weight.fromKg(-10)).toThrow("Weight cannot be negative");
  });
});

describe("UserConfig", () => {
  it("should create a UserConfig object with consistent properties", () => {
    const userConfig: UserConfig = {
      preferredUnit: "kg",
      // Add other properties if defined in UserConfig
    };

    expect(userConfig.preferredUnit).toBe("kg");
    // Add more assertions for other properties of UserConfig if needed
  });
});