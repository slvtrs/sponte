import React from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';

import Layout from './constants/Layout'
import Content from './constants/Content'

import MyProfile from './views/MyProfile';
import Profile from './views/Profile';
import Feed from './views/Feed';

export default class App extends React.Component {

  constructor(){
    super()
    this.state = {
      feed: true,
      bgView: 'MyProfile',
    }
  }

  render() {
    let { feed, bgView } = this.state
    return (
      <View style={styles.container}>
        <MyProfile onHide={this.goToFeed} visible={bgView=='MyProfile'} />
        <Profile onHide={this.goToFeed} visible={bgView=='Profile'} />
        <Feed 
          show={feed} 
          bgView={bgView}
          handleDidHide={this.handleLeftFeed} 
          setBgView={this.setBgView} 
        />
      </View>
    );
  }

  goToFeed = () => {
    this.setState({feed: true})
  }

  handleLeftFeed = () => {
    this.setState({feed: false})
  }

  setBgView = view => {
    this.setState({bgView: view})
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
