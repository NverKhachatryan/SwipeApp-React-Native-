import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class App extends React.Component{
  
  state = { 
    hasLocationPermission: false,
    latitude: 0,
    longitude: 0,
    restaurantList: []
  }
  componentDidMount() {
    this.getLocationAsync();
  };
  
  async getLocationAsync () {
    const { status } = await Permissions.askAsync(
      Permissions.LOCATION
    );
    
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});

      this.setState({
        hasLocationPermissions: true,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } else {
      alert('Location permission not granted');
    }
    
  };

  handleRestaurantSearch = () => {
    const location = `location=${this.state.latitude},${this.state.longitude}`; 
    
    
    fetch(`https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?latitude=${this.state.latitude}&longitude=${this.state.longitude}&limit=30&currency=USD&distance=2000&open_now=false&lunit=km&lang=en_US`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
        "x-rapidapi-key": "66793091c5mshccead1a3d06a524p1059b8jsnc99793b18717"
      }
    })
      
      .then(response => response.json())
      .then(results => this.setState({restaurantList: results}))

      .catch(err => {
        console.error(err);
      });
  }
 
  render() {
    console.log(this.state.restaurantList)
    return (
      <View style={this.styles.container}>
        <FlatList  
          data={this.state.restaurantList}
          renderItem={({item}) => (
            <Text>{item.name}</Text>
          )}
          
          
          style={{backgroundColor: 'grey', width: '80%', margin: 60, padding: 5}}
        />
        <TouchableOpacity onPress={() => this.handleRestaurantSearch()}>
          <Text style={{backgroundColor: 'grey', color: 'white', padding: 20, marginBottom: 50}}>Search Restaurants</Text>
        </TouchableOpacity>
        
        <StatusBar style="auto" />
      </View>
    );
  }

  styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
