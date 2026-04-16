export interface RpeValue {
  rpe: number;
  description: string; // e.g., "Warm-up", "Hard", "Maximal Effort"
}

export interface RpeTable {
  values: RpeValue[];
}