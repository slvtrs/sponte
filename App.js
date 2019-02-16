import React from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';
import Layout from 'app/constants/Layout'
import Content from 'app/constants/Content'

import Push from 'app/utilities/Push'

import MyProfile from 'app/views/MyProfile';
import Profile from 'app/views/Profile';
import Feed from 'app/views/Feed';

export default class App extends React.Component {

  constructor(){
    super()
    this.state = {
      feed: true,
      bgView: 'MyProfile',
    }
  }

  componentDidMount(){
    Push.registerForPushNotificationsAsync()
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
