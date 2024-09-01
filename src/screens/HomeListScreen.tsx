import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useHomes} from '../context/HomeContext';
import {useAuth} from '../context/AuthContext';
import Geolocation from 'react-native-geolocation-service';

const HomeListScreen: React.FC = () => {
  const {homes, addHome, loading} = useHomes();
  const {logout} = useAuth();
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.error('Error getting location:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  const handleAddHome = () => {
    if (currentLocation) {
      const newHome = {
        id: `${homes.length + 1}`,
        address: `Current Location: ${currentLocation.latitude}, ${currentLocation.longitude}`,
        description: 'New home added from your current location.',
        image: 'https://via.placeholder.com/150',
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      };
      addHome(newHome);
    } else {
      console.warn('Current location is not available.');
    }
  };

  const isHomeInCurrentArea = (home: {latitude: number; longitude: number}) => {
    if (!currentLocation) return false;
    const distance = Math.sqrt(
      Math.pow(home.latitude - currentLocation.latitude, 2) +
        Math.pow(home.longitude - currentLocation.longitude, 2),
    );
    return distance < 0.0003; // Approx ~30m (this is a rough estimate, for exact distance calculations use Haversine formula)
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={homes}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.homeItem,
              isHomeInCurrentArea(item) && styles.currentAreaBorder,
            ]}
            onPress={() => navigation.navigate('HomeDetails', {home: item})}>
            <View>
              <View style={{marginVertical: 5}}>
                <Image
                  source={{uri: `${item.image}?random=${new Date().getTime()}`}}
                  style={styles.image}
                />
              </View>
              <View style={styles.homeInfo}>
                <Text>{item.address}</Text>
                <Text>{item.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddHome}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  homeItem: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentAreaBorder: {
    borderColor: 'green',
    borderWidth: 2,
  },
  image: {
    width: Dimensions.get('screen').width - 30,
    height: Dimensions.get('screen').height / 6,
  },
  homeInfo: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeListScreen;
