import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';

import Layout from '../constants/Layout'
import Content from '../constants/Content'

export default class MyProfile extends React.Component {
  constructor(){
    super()
    this.state = {
      windowOpen: moment().subtract(30,'s'),
      status: '',
      statusText: '',
    }
  }

  componentDidMount(){
    this.windowInterval = setInterval(this.updateWindow , 1000)
  }

  componentWillUnmount(){
    if(this.windowInterval){
      clearInterval(this.windowInterval)
    }
  }

  updateWindow = () => {
    let { windowOpen } = this.state
    let status
    let statusText
    if(moment().isSame(windowOpen, 'day')){
      const windowClose = moment(windowOpen).add(1, 'm')
      if(moment().isSameOrBefore(windowClose)){
        status = 'open'
        let msDiff = windowClose.diff(moment())
        let secDiff = Math.floor(msDiff/1000)
        statusText = `${secDiff} second${secDiff === 1 ? '' : 's'} remaining`
      }
      else {
        status = 'closed'
        statusText = 'Window has closed for today. Try again tomorrow.'
      }
    }
    else {
      status = 'waiting'
      statusText = "Waiting for today's window to open..."
    }
    this.setState({
      status,
      statusText
    })
  }

  render() {
    let { windowOpen, status, statusText } = this.state

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.text}>My Profile</Text>
        </View>
        <View style={[styles.statusWrapper]}>
          <Text style={styles[status]}>{statusText}</Text>
        </View>
        <TouchableOpacity onPress={this.handlePost} disabled={status!='open'}>
          <View>
            <MaterialCommunityIcons name={`plus-circle`} size={140} color={status!='open' ? 'gray' : 'blue'} style={styles.icon} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.props.onHide}>
          <Text style={styles.text}>Return</Text>
        </TouchableOpacity>
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
  open: { color: 'green' },
  waiting: { color: 'blue' },
  closed: { color: 'red' },
});
