import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {AuthProvider} from './src/context/AuthContext';
import {HomeProvider} from './src/context/HomeContext';
import HomeDetailsScreen from './src/screens/HomeDetailsScreen';
import HomeListScreen from './src/screens/HomeListScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <HomeProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="HomeList" component={HomeListScreen} />
            <Stack.Screen name="HomeDetails" component={HomeDetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </HomeProvider>
    </AuthProvider>
  );
};

export default App;
