import React from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';

import Layout from './constants/Layout'
import Content from './constants/Content'

import MyProfile from './views/MyProfile';
import Feed from './views/Feed';

export default class App extends React.Component {

  constructor(){
    super()
    this.state = {
      feed: true,
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MyProfile onHide={this.goToFeed} />
        <Feed show={this.state.feed} handleDidHide={this.handleLeftFeed} />
      </View>
    );
  }

  goToFeed = () => {
    this.setState({feed: true})
  }

  handleLeftFeed = () => {
    this.setState({feed: false})
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
