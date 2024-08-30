import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  Button,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {unlockHome} from '../utils/api';
import {useAuth} from '../context/AuthContext';

const HomeDetailsScreen: React.FC = ({route}) => {
  const {home} = route.params;
  const [canUnlock, setCanUnlock] = useState(false);
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
        console.log('distance', distance);
        // setCanUnlock(distance <= 0.03); // 30 meters
        setCanUnlock(distance <= 4.03); // 30 meters
        // setCanUnlock(true);
      },
      error => Alert.alert('Error', error.message),
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleUnlock = async () => {
    try {
      const response = await unlockHome(home.id);
      Alert.alert('Success', response.message);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  console.log('isAuthenticated', isAuthenticated);

  return (
    <View>
      <Image source={{uri: home.image}} style={{width: '100%', height: 200}} />
      <Text>{home.address}</Text>
      <Text>{home.description}</Text>
      {isAuthenticated && (
        <>
          {canUnlock ? (
            <Button title="Unlock" onPress={handleUnlock} />
          ) : (
            <Button title="Check Proximity" onPress={checkProximity} />
          )}
        </>
      )}
    </View>
  );
};

// Helper function to calculate distance
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
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

const deg2rad = deg => deg * (Math.PI / 180);

export default HomeDetailsScreen;
