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
    Animated.sequence([
      Animated.timing(this.state.animOne, {
        toValue: 1,
        duration: (this.props.duration * 1000) / 4,
        delay: 0,
      }),
      // Animated.timing(this.state.buzzLeftAnim, {
      //   toValue: -4 * intensity,
      //   duration: 50 + (10 * (10-this._healthValue)),
      // })
    ]).start(() => {
    })
  }

  render() {
    let { duration } = this.props
    let { animOne, animTwo, animThree, animFour, } = this.state

    let progressOne = animOne.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '90deg'],
    })

    return (
      <View style={styles.wrapper}>
        <View style={styles.recordingButton} />
        <View style={[styles.ring, styles.gutter]}>
          {/*<Animated.View style={[styles.ring, styles.progress, {transform: [{rotateZ: progressOne}]}]} />*/}
          <Animated.View style={[styles.ring, styles.progress]} />
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
    // marginBottom: 40,
    // justifyContent: 'center',
    // alignItems: 'center',
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
  },
  progress: {
    borderTopColor: '#fff',
    borderRightColor: '#fff',
    borderColor: 'red',
    position: 'absolute',
    transform: [{rotateZ: '45deg'}],
    // borderRadius: 10,
  },
  curtain: {
    borderTopColor: 'red',
    borderRightColor: 'red',
  },
  recordingButton: {
    position: 'absolute',
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#d88',
    opacity: 0.9,
  },
});