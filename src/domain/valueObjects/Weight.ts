export class Weight {
  private readonly value: number;
  private readonly unit: 'kg' | 'lbs';

  private static readonly KG_TO_LBS_FACTOR = 2.20462; // 1 kg = 2.20462 lbs
  private static readonly LBS_TO_KG_FACTOR = 0.453592; // 1 lbs = 0.453592 kg

  private constructor(value: number, unit: 'kg' | 'lbs') {
    if (value < 0) {
      throw new Error("Weight cannot be negative");
    }
    this.value = value;
    this.unit = unit;
  }

  public static fromKg(value: number): Weight {
    return new Weight(value, 'kg');
  }

  public static fromLbs(value: number): Weight {
    return new Weight(value, 'lbs');
  }

  public toKg(): number {
    if (this.unit === 'kg') {
      return this.value;
    } else {
      return this.value * Weight.LBS_TO_KG_FACTOR;
    }
  }

  public toLbs(): number {
    if (this.unit === 'lbs') {
      return this.value;
    } else {
      return this.value * Weight.KG_TO_LBS_FACTOR;
    }
  }

  public getValue(unit: 'kg' | 'lbs'): number {
    if (unit === 'kg') {
      return this.toKg();
    } else {
      return this.toLbs();
    }
  }

  public getUnit(): 'kg' | 'lbs' {
    return this.unit;
  }

  public equals(other: Weight): boolean {
    if (this.unit === other.unit) {
      return this.value === other.value;
    } else {
      // Compare by converting both to kg for consistency with a small tolerance for floating-point inaccuracies
      const tolerance = 0.001; // 1 gram tolerance
      return Math.abs(this.toKg() - other.toKg()) < tolerance;
    }
  }
}