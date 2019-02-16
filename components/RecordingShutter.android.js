import React from 'react';
import PropTypes from 'prop-types'
import { LinearGradient } from 'expo';
import Colors from '../constants/Colors';
import { Text, TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import Layout from '../constants/Layout';

export default class RecordingShutter extends React.Component {  
  static propTypes = {
    duration: PropTypes.number,
  }

  static defaultProps = {
    duration: 7,
  }

  constructor(props){
    super(props)
    this.state = {
      animOne: new Animated.Value(0),
      animTwo: new Animated.Value(0),
      animThree: new Animated.Value(0),
      animFour: new Animated.Value(0),
    }
  }

  componentDidMount(){
    Animated.timing(this.state.animOne, {
      toValue: 1,
      duration: (this.props.duration * 1000),
      delay: 0,
    }).start()
  }

  render() {
    let { duration } = this.props
    let { animOne, animTwo, animThree, animFour, } = this.state

    let progressOne = animOne.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 0],
    })

    return (
      <View style={styles.wrapper}>
        <View style={[styles.ring, styles.gutter]}>
          <Animated.View style={[
            styles.ring, styles.recordingButton, 
            {width: progressOne, height: progressOne}            
          ]} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  ring: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'transparent',
  },
  gutter: {
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  recordingButton: {
    position: 'absolute',
    backgroundColor: '#d88',
    opacity: 0.9,
    borderWidth: 0,
  },
});