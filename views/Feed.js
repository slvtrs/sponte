import React from 'react';
import { StyleSheet, Text, View, Animated, PanResponder, Dimensions } from 'react-native';

import Layout from '../constants/Layout'
import Content from '../constants/Content'

import Carousel from '../components/Carousel';

export default class Feed extends React.Component {

  constructor(){
    super()
    this.state = {
      visible: true,
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.props.show && !prevProps.show) {
      this.handleReveal()
    }
  }

  componentWillMount() {
    this.screenHeight = Dimensions.get('screen').height
    this.yOffsetAnim = new Animated.Value(0);
    this._yOffset = 0
    this.yOffsetAnim.addListener((value) => {
      // console.log(value.value)
      this._yOffset = Math.max( 0, value.value)
    })

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (e, gestureState) => {
        this.yOffsetAnim.setOffset(this._yOffset)
        this.yOffsetAnim.setValue(0)
      },
      onPanResponderMove: Animated.event([
        null, { dx: 0, dy: this.yOffsetAnim}
      ]),
      // onPanResponderMove: (e: Object, gestureState: Object) => {
      //   console.log(this._yOffset)
      //   return Animated.event([
      //     null, { dx: 0, dy: this.yOffsetAnim}
      //   ])
      // },
      onPanResponderRelease: (e, gestureState) => {
        let bottom = this.screenHeight - 60
        let target = 0
        let speed = 5
        if(this.state.visible){
          if (this.yOffsetAnim._value >= 150) {
            target = bottom
            speed = 10
            this.props.handleDidHide()
            this.setState({visible: false})
          }
        }
        else {
          target = -(bottom)
          this.setState({visible: true})
        }

        Animated.spring(this.yOffsetAnim, {
          toValue: target,
          speed: speed,
          bounicness: 5,
          overshootClamping: true,
        }).start();
        // this.yOffsetAnim.flattenOffset();
        // Animated.decay(this.yOffsetAnim, {
        //   deceleration: 0.997,
        //   // velocity: { x: gestureState.vx, y: gestureState.vy }
        //   velocity: { x: 0, y: gestureState.vy }
        // }).start();
      },
    })
  }

  handleReveal = () => {
    this.setState({visible: true})
    Animated.spring(this.yOffsetAnim, {
      toValue: 0,
      speed: 5,
      bounicness: 5,
      overshootClamping: true,
    }).start();
  }
    
  render() {
    let yOffset = this.yOffsetAnim.interpolate({
      inputRange: [0, Infinity],
      outputRange: [0, Infinity],
      extrapolate: 'clamp',
    });

    return (
        <Animated.View 
          style={[
            styles.container,
            {top: yOffset},
          ]} 
          //{...this.panResponder.panHandlers}
        >
          <Carousel propagateTouch={!this.state.visible} onReveal={this.handleReveal} />
        </Animated.View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0, right: 0, left: 0, 
    height: Dimensions.get('screen').height,
    backgroundColor: "#333",
  },
  text: {
    color: "#FFF",
    fontSize: 20,
  }
});
