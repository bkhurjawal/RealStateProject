import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {useHomes} from '../context/HomeContext';

const HomeListScreen: React.FC = () => {
  const {homes, loading} = useHomes();
  const navigation = useNavigation();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={homes}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeDetails', {home: item})}>
          <View>
            <Image
              source={{uri: `${item.image}?random=${new Date().getTime()}`}}
              style={{width: 150, height: 150}}
            />
            <Text>{item.address}</Text>
            <Text>{item.description}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default HomeListScreen;
