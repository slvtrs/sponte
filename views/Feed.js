import React from 'react';
import { StyleSheet, Text, View, Animated, PanResponder, Dimensions } from 'react-native';

import moment from 'moment';
import Layout from 'app/constants/Layout'
import Content from 'app/constants/Content'
import Colors from 'app/constants/Colors'

const HEIGHT = Dimensions.get('window').height
import apiActions from 'app/utilities/Actions';

import Carousel from 'app/components/Carousel';

export default class Feed extends React.Component {

  constructor(){
    super()
    this.state = {
      visible: true,
      yOffset: 0,
      items: [],
      loading: true,
    }
    this._swipeDirection
  }

  componentDidMount = async () => {
    let res = await apiActions.request('posts', 'GET', null, 4).catch(e => console.warn(e))
    let items = res.posts
    this.setState({
      items,
      loading: false,
    })
    if(items.length){
      let otherId = items[0].profile_id
      this.props.setOtherId(otherId)
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
      // this._yOffset = Math.max( 0, value.value)
      // this.setState({yOffset: this._yOffset})
      this.setState({yOffset: value.value})
      if(value.value >= 0 && this.props.bgView != 'MyProfile'){
        this.props.setBgView('MyProfile')
      }
      else if(value.value < 0 && this.props.bgView != 'Profile'){
        this.props.setBgView('Profile')
      }
    })

    this.panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        if (Math.abs(gestureState.dy) > 10) {
          return true;
        }
        return false;
      },
      onMoveShouldSetPanResponder: this.canMove,
      onPanResponderGrant: () => {
        this.yOffsetAnim.setOffset(this._yOffset)
        this.yOffsetAnim.setValue(0)
      },
      onPanResponderMove: (e, gestureState) => {
        if(!this._swipeDirection) this.checkSwipeDirection(gestureState);
        // if (this.isSwipingOverLeftBorder(gestureState) ||
        //   this.isSwipingOverRightBorder(gestureState)) return;

        Animated.event([null, { 
          dx: 0, dy: this.yOffsetAnim
        }])(e, gestureState);
      },
      onPanResponderRelease: (e, gestureState) => {
        this._swipeDirection = null;

        this.yOffsetAnim.flattenOffset();

        // if (this.isSwipingOverLeftBorder(gestureState) ||
        //     this.isSwipingOverRightBorder(gestureState)) {
        //     return;
        // }

        let threshold = 100
        let bottom = this.screenHeight - 100
        let target = 0
        let speed = 5
        if(this.state.visible){
          if (this.yOffsetAnim._value >= threshold) {
            target = bottom
            speed = 10
            this.props.handleDidHide()
            this.setState({visible: false})
          }
          else if (this.yOffsetAnim._value <= -threshold) {
            target = -bottom + 40
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

  checkSwipeDirection(gestureState) {
    if( 
      (Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 0.6) ) &&
      (Math.abs(gestureState.vx) > Math.abs(gestureState.vy * 0.6) )
    ) {
      this._swipeDirection = "horizontal";
    } else {
      this._swipeDirection = "vertical";
    }
    console.log('slideDir is', this._swipeDirection)
  }
  canMove() {
    setTimeout(() => {

    if(this._swipeDirection === "vertical") {
      // console.log('can move')
      return true;
    } else {
      // console.log('CANT')
      return true;
    }

    },0)
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
    let { items, loading, visible, } = this.state
    let yOffset = this.yOffsetAnim.interpolate({
      inputRange: [-9999, Infinity],
      outputRange: [-9999, Infinity],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View 
        style={[
          styles.pan,
          {top: yOffset},
        ]} 
        {...this.panResponder.panHandlers}
      >
        <Carousel 
          items={items} 
          loading={loading} 
          propagateTouch={!visible} 
          onReveal={this.handleReveal} 
          yOffset={this.state.yOffset} 
          onSetStep={this.handleSetStep} 
          feedExpired={this.props.feedExpired}
        />
      </Animated.View>
    );
  }

  handleSetStep = (step) => {
    let { items } = this.state
    let item = items[step]
    if(item){
      let otherId = item.profile_id
      this.props.setOtherId(otherId)
    }
  }

}

const styles = StyleSheet.create({
  pan: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0, right: 0, left: 0, 
    height: HEIGHT,
    backgroundColor: Colors.blue,
  },
  text: {
    color: "#FFF",
    fontSize: 20,
  }
});
