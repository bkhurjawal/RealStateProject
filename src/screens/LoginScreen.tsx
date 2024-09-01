import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {users} from '../utils/mockData';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState(users[0].username);
  const [password, setPassword] = useState(users[0].password);
  const {login} = useAuth();
  const navigation = useNavigation();

  const handleLogin = () => {
    const user = users.find(
      u => u.username === username && u.password === password,
    );
    if (user) {
      login(); // Set the authentication state

      setTimeout(() => {
        navigation.navigate('HomeList'); // Navigate to the home list screen after state update
      }, 0);
    } else {
      Alert.alert(
        'Invalid Credentials',
        'Please check your username and password.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to RealEstateApp</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          Alert.alert('Feature Coming Soon!', 'Sign up is not yet available.')
        }>
        <Text style={styles.signUpText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpText: {
    color: '#4CAF50',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default LoginScreen;
