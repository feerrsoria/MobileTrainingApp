import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import WorkoutScreen from '../screens/WorkoutScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import { Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoutine } from "../hooks/useRoutine";
import { AsyncStorageRepository } from "../../infrastructure/repositories/AsyncStorageRepository";

const Tab = createBottomTabNavigator();

const HistoryScreen = () => <Text>History</Text>;
const SettingsScreen = () => <Text>Settings</Text>;
const ProfileScreen = () => <Text>Profile</Text>;

const AppNavigator = () => {
  const repository = new AsyncStorageRepository();
  const { trainingPlan, isLoading } = useRoutine(repository);
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !trainingPlan) {
      setShowOnboarding(true);
    }
  }, [isLoading, trainingPlan]);

  if (showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Routine" 
          component={WorkoutScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="History" 
          component={HistoryScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="history" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
