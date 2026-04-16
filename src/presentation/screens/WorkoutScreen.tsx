import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Card, TextInput, Button, PaperProvider, Appbar, List, Divider } from 'react-native-paper';
import { useRoutine } from '../hooks/useRoutine';
import { IRepository } from '../../infrastructure/repositories/IRepository';
import { AsyncStorageRepository } from '../../infrastructure/repositories/AsyncStorageRepository';
import { TonnageCalculatorServiceImpl } from '../../domain/services/implementations/TonnageCalculatorServiceImpl';
import { Weight } from '../../domain/valueObjects/Weight';
import { ProgressionEngine } from "../../domain/services/ProgressionEngine";
import { Linear5x5Strategy } from "../../domain/services/progressionStrategies/Linear5x5Strategy";
import { WaveOndulantStrategy } from "../../domain/services/progressionStrategies/WaveOndulantStrategy";

const WorkoutScreen = () => {
  const repository: IRepository = new AsyncStorageRepository();
  const { trainingPlan, userConfig, isLoading, error } = useRoutine(repository);
  const tonnageCalculator = new TonnageCalculatorServiceImpl();
  const progressionEngine = new ProgressionEngine();
  progressionEngine.registerStrategy("Linear5x5", new Linear5x5Strategy());
  progressionEngine.registerStrategy("WaveOndulant", new WaveOndulantStrategy());

  const [currentSets, setCurrentSets] = useState<{ [exerciseName: string]: { weight: string, reps: string, rpe: string }[] }>({});

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const today = new Date().getDay(); // Assuming Sunday is 0
  const currentSession = trainingPlan?.mesocycles[0]?.microcycles[0]?.sessions[today];

  const handleSetChange = (exerciseName: string, setIndex: number, field: string, value: string) => {
    setCurrentSets(prev => ({
      ...prev,
      [exerciseName]: [
        ...(prev[exerciseName] || []),
        { ...((prev[exerciseName] || [])[setIndex] || {}), [field]: value },
      ],
    }));
  };

  const calculateTonnage = (exerciseName: string) => {
    if (!currentSets[exerciseName]) return 0;
    return currentSets[exerciseName].reduce((total, set) => {
      const weight = Weight.fromKg(parseFloat(set.weight) || 0);
      return total + tonnageCalculator.calculateTonnage(weight, parseInt(set.reps) || 0, 1);
    }, 0);
  };

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="Workout" />
      </Appbar.Header>
      <View style={{ padding: 16 }}>
        {currentSession ? (
          <Card>
            <Card.Title title={`Day ${currentSession.sessionNumber}`} />
            <Card.Content>
              <List.Section>
                {currentSession.exercises.map((exercise, idx) => (
                  <List.Accordion
                    key={idx}
                    title={exercise.name}
                    description={`Tonnage: ${calculateTonnage(exercise.name).toFixed(2)}`}
                    left={props => <List.Icon {...props} icon="weight-lifter" />}
                  >
                    {exercise.sets.map((set, setIdx) => (
                      <View key={setIdx} style={{ padding: 8 }}>
                        <TextInput
                          label="Weight"
                          value={currentSets[exercise.name]?.[setIdx]?.weight || ''}
                          onChangeText={text => handleSetChange(exercise.name, setIdx, 'weight', text)}
                          keyboardType="numeric"
                        />
                        <TextInput
                          label="Reps"
                          value={currentSets[exercise.name]?.[setIdx]?.reps || ''}
                          onChangeText={text => handleSetChange(exercise.name, setIdx, 'reps', text)}
                          keyboardType="numeric"
                        />
                        <TextInput
                          label="RPE"
                          value={currentSets[exercise.name]?.[setIdx]?.rpe || ''}
                          onChangeText={text => handleSetChange(exercise.name, setIdx, 'rpe', text)}
                          keyboardType="numeric"
                        />
                        <Divider style={{ marginVertical: 8 }} />
                      </View>
                    ))}
                    <Button mode="contained" onPress={() => {
                      if (currentSession && userConfig) {
                        const suggestion = progressionEngine.suggestProgression(
                          userConfig.trainingObjective === "Strength" ? "Linear5x5" : "WaveOndulant",
                          trainingPlan?.mesocycles[0]?.microcycles[0]?.sessions || [],
                          exercise.name,
                          {
                            id: userConfig.id,
                            name: userConfig.name,
                            level: userConfig.trainingLevel,
                          }
                        );
                        if (suggestion) {
                          alert(`Next time for ${exercise.name}: ${suggestion.suggestedRepetitions} reps at ${suggestion.suggestedWeight}kg`);
                        } else {
                          alert("No progression suggestion available.");
                        }
                      }
                    }}>
                      Complete Workout
                    </Button>
                  </List.Accordion>
                ))}
              </List.Section>
            </Card.Content>
          </Card>
        ) : (
          <Text>No workout scheduled for today.</Text>
        )}
      </View>
    </PaperProvider>
  );
};

export default WorkoutScreen;
