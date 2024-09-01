import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthProvider, useAuth} from './src/context/AuthContext';
import {HomeProvider} from './src/context/HomeContext';
import HomeDetailsScreen from './src/screens/HomeDetailsScreen';
import HomeListScreen from './src/screens/HomeListScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <HomeProvider>
        <NavigationContainer>
          <AuthNavigator />
        </NavigationContainer>
      </HomeProvider>
    </AuthProvider>
  );
};

const AuthNavigator: React.FC = () => {
  const {isAuthenticated} = useAuth();

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="HomeList" component={HomeListScreen} />
          <Stack.Screen name="HomeDetails" component={HomeDetailsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default App;
