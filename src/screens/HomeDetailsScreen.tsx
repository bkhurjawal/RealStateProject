import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
  StyleSheet,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {unlockHome, lockHome} from '../utils/api';
import {useAuth} from '../context/AuthContext';

const HomeDetailsScreen: React.FC = ({route}) => {
  const {home} = route.params;
  const [canUnlock, setCanUnlock] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const {isAuthenticated} = useAuth();

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to unlock homes.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else if (Platform.OS === 'ios') {
      const response = await Geolocation.requestAuthorization('whenInUse');
      return response === 'granted';
    }
    return false;
  };

  const checkProximity = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Location permission is required to unlock homes.',
      );
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const distance = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          home.latitude,
          home.longitude,
        );

        if (distance <= 0.03) {
          setCanUnlock(true); // User is within 30 meters
        } else {
          setCanUnlock(false);
          Alert.alert(
            'Out of Range',
            'You must be within 30 meters to unlock the home.',
          );
        }
      },
      error => Alert.alert('Error', error.message),
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleUnlock = async () => {
    try {
      const response = await unlockHome(home.id);
      Alert.alert('Success', response.message);
      setIsUnlocked(true);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLock = async () => {
    try {
      const response = await lockHome(home.id);
      Alert.alert('Success', response.message);
      setIsUnlocked(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{uri: home.image}} style={styles.image} />
      <Text style={styles.title}>{home.address}</Text>
      <Text style={styles.description}>{home.description}</Text>
      {isAuthenticated && (
        <>
          {canUnlock ? (
            isUnlocked ? (
              <TouchableOpacity style={styles.button} onPress={handleLock}>
                <Text style={styles.buttonText}>Lock</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleUnlock}>
                <Text style={styles.buttonText}>Unlock</Text>
              </TouchableOpacity>
            )
          ) : (
            <TouchableOpacity style={styles.button} onPress={checkProximity}>
              <Text style={styles.buttonText}>Check Proximity</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

// Helper function to calculate distance
const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const deg2rad = (deg: number) => deg * (Math.PI / 180);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeDetailsScreen;
