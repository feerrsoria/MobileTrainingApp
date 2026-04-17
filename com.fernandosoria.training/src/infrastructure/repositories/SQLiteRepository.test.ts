import { SQLiteRepository } from "./SQLiteRepository";
import { UserConfig, TrainingLevel, TrainingObjective } from "../../domain/types";

jest.mock("../db", () => ({
  db: {
    execAsync: jest.fn(),
    runAsync: jest.fn(),
    getFirstAsync: jest.fn(),
  },
}));

describe("SQLiteRepository", () => {
  let repository: SQLiteRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new SQLiteRepository();
  });

  it("should save user config", async () => {
    const userConfig: UserConfig = {
      id: "1",
      name: "Test User",
      trainingLevel: TrainingLevel.Beginner,
      trainingObjective: TrainingObjective.Strength,
    };

    await repository.saveUserConfig(userConfig);

    const { db } = require("../db");
    expect(db.runAsync).toHaveBeenCalledWith(
      "INSERT OR REPLACE INTO user_config (id, config) VALUES (1, ?);",
      JSON.stringify(userConfig)
    );
  });

  it("should get user config", async () => {
    const userConfig: UserConfig = {
      id: "1",
      name: "Test User",
      trainingLevel: TrainingLevel.Beginner,
      trainingObjective: TrainingObjective.Strength,
    };
    const { db } = require("../db");
    db.getFirstAsync.mockResolvedValue({ config: JSON.stringify(userConfig) });

    const retrievedConfig = await repository.getUserConfig();

    expect(db.getFirstAsync).toHaveBeenCalledWith("SELECT config FROM user_config WHERE id = 1;");
    expect(retrievedConfig).toEqual(userConfig);
  });
});
