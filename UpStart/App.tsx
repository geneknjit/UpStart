import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import CharactersScreen from './src/screens/CharactersScreen';
import SpellsScreen from './src/screens/SpellsScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Characters: undefined;
  Spells: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Characters"
            component={CharactersScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: '#0E0E1A' },
              headerTintColor: '#f5d742',
              title: '✨ Characters',
            }}
          />
          <Stack.Screen
            name="Spells"
            component={SpellsScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: '#0E0E1A' },
              headerTintColor: '#f5d742',
              title: '🪄 Spells',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
