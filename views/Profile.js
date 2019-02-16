import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import Layout from 'app/constants/Layout'
import Content from 'app/constants/Content'
import Button from 'app/components/Button'

export default class Profile extends React.Component {

  render() {
    return (
      <View style={[styles.container, this.props.visible ? null : styles.hidden]}>
          <Text style={styles.text}>Other Profile</Text>
          <View style={styles.buttonWrapper}>
            <Button onPress={this.props.onHide}>
              Return
            </Button>
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
    height: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  button : {
    borderWidth: 1,
    padding: 10,
  },
  text: {
    textAlign: 'center',
  },
  buttonWrapper: {
    alignSelf: 'stretch',
    paddingHorizontal: 20,
  },
});
