import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import Layout from '../constants/Layout'
import Content from '../constants/Content'


export default class Profile extends React.Component {

  render() {
    return (
      <View style={[styles.container, this.props.visible ? null : styles.hidden]}>
        <View>
          <Text style={styles.text}>Other Profile</Text>
          <TouchableOpacity style={styles.button} onPress={this.props.onHide}>
            <Text style={styles.text}>Return</Text>
          </TouchableOpacity>
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
    backgroundColor: '#fdd',
    alignItems: 'center',
    justifyContent: 'space-around',
    ...StyleSheet.absoluteFillObject,
  },
  hidden: {
    display: 'none',
  },
  button : {
    borderWidth: 1,
    padding: 10,
  },
  text: {
    textAlign: 'center',
  },
  button : {
    borderWidth: 1,
    padding: 10,
    marginVertical: 40,
  },
});
