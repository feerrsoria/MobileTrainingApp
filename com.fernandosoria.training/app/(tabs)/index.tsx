import React from 'react';
import { Text } from 'react-native';
import { useRoutine } from '@/src/hooks/useRoutine';
import { IRepository } from '@/src/infrastructure/repositories/IRepository';
import { SQLiteRepository } from '@/src/infrastructure/repositories/SQLiteRepository';
import RoutineGenerator from "@/components/routine/routine-generator";
import WorkoutView from '@/components/routine/workout-view';

const WorkoutScreen = () => {
  const repository: IRepository = new SQLiteRepository();
  const { trainingPlan, userConfig, isLoading, error } = useRoutine(repository);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!trainingPlan || !userConfig) {
    return <RoutineGenerator />;
  }

  return <WorkoutView trainingPlan={trainingPlan} userConfig={userConfig} />;
};

export default WorkoutScreen;
