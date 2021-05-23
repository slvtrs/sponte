import React from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';
import Layout from 'app/constants/Layout'
import Content from 'app/constants/Content'
import moment from 'moment';

import { Notifications } from 'expo';
import Push from 'app/utilities/Push'

import MyProfile from 'app/views/MyProfile';
import Profile from 'app/views/Profile';
import Feed from 'app/views/Feed';
import Ftue from 'app/views/Ftue';
import CameraView from 'app/views/CameraView'

export default class App extends React.Component {

  constructor(){
    super()
    this.state = {
      feed: true,
      bgView: 'MyProfile',
      otherId: 0,
      lastPostAt: null,
      firstVisit: false,
      cameraOpen: false,
    }
  }

  componentDidMount(){
    Push.registerForPushNotificationsAsync()
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
    // this.setState({cameraOpen: true})
  }

  _handleNotification = (notification) => {
    console.log('NOTIF RECEIVED')
    // console.log(notification)
    // notification.origin can == 'selected' if notification was tapped or 'received' if app already in foreground
    console.log('origin:', notification.origin)
    // console.log('data:', JSON.stringify(notification.data))
    console.log(notification.data.window_open_at)
    let windowOpenAt = moment(notification.data.window_open_at)
    let windowCloseAt = moment(notification.data.window_close_at)
    // if( windowOpenAt.isAfter(moment().subtract(5,'m')) ){
    if(windowCloseAt.isAfter(moment())){
      this.setState({cameraOpen: true})
    }
    else {
      let duration = windowCloseAt.diff(windowOpenAt, 'minutes')
      alert(`Too late! Today's ${duration} minute window has closed.`)
    }
  };

  handleDismissCamera = () => {
    this.setState({cameraOpen: false})
  }

  handlePostSuccess = post => {
    // let { posts } = this.state
    // posts.push(post)
    // this.setState({posts})
    let lastPostAt = moment(post.created_at)
    this.setState({lastPostAt})
  }

  render() {
    let { feed, bgView, otherId, lastPostAt, firstVisit, cameraOpen } = this.state
    return (
      <View style={styles.container}>
        <MyProfile onHide={this.goToFeed} visible={bgView=='MyProfile'} setLastPostAt={this.setLastPostAt} setFirstVisit={(firstVisit) => this.setState({firstVisit})} />
        <Profile onHide={this.goToFeed} visible={bgView=='Profile'} id={otherId} feedExpired={this.determineFeedExpired()} />
        <Feed 
          show={feed} 
          bgView={bgView}
          handleDidHide={this.handleLeftFeed} 
          setBgView={this.setBgView} 
          setOtherId={(otherId) => this.setState({otherId})}
          feedExpired={this.determineFeedExpired()}
        />
        {firstVisit && (
          <Ftue 
            onComplete={() => this.setState({firstVisit: false})} 
            onBegin={() => this.setState({cameraOpen: true})}
          />
        )}
        {cameraOpen && (
          <CameraView 
            onCancel={this.handleDismissCamera} 
            onPostSuccess={this.handlePostSuccess}
            uploadVideo={(videoUri) => {
              console.log(videoUri)
              // let { videos } = this.state
              // videos.push(videoUri)
              // this.setState({videos})
            }}
          />
        )}
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

  setLastPostAt = lastPostAt => {
    this.setState({lastPostAt})
  }

  determineFeedExpired = () => {
    let { lastPostAt } = this.state
    if(lastPostAt === null) return null
    else {
      return lastPostAt.isBefore(moment().subtract(1,'d'))
    }
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
