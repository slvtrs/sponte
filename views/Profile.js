import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import Layout from '../constants/Layout'
import Content from '../constants/Content'


export default class Profile extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.text}>Other Profile</Text>
        </View>
      </View>
    );
  }

  handlePost = () => {
    alert('post')
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button : {
    borderWidth: 1,
    padding: 10,
  },
  text: {
    // color: 'white'
  },
});
