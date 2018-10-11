import React from 'react';
import PropTypes from 'prop-types'
import Colors from '../constants/Colors';
import { Text, TouchableOpacity, TouchableWithoutFeedback, View, StyleSheet, Animated, Easing, Image, Dimensions, ScrollView, Platform } from 'react-native';

import Actions from '../utilities/Actions';

const WIDTH = Dimensions.get('screen').width

export default class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      step: 0,
      animLeft: new Animated.Value(0),
      propagateTouch: false,
    }    
    this._scrollX = new Animated.Value(0)
  }

  componentDidMount(){
    Actions.getCats(5).then(cats => {
        // console.log(cats)
      this.setState({
        items: cats,
        loading: false,
      })
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot){}

  render() {
    let { items, loading, step } = this.state
    
    let leftRot = this._scrollX.interpolate({
      inputRange: [0, WIDTH],
      // outputRange: ['0deg', `-90deg`],
      outputRange: ['0deg', `60deg`],
      extrapolate: 'clamp',
    });
    let rightRot = this._scrollX.interpolate({
      inputRange: [0, WIDTH],
      // outputRange: ['90deg', `0deg`],
      outputRange: ['-60deg', `0deg`],
      extrapolate: 'clamp',
    });

    if(loading) return <View />

    return (
      <View style={styles.container}>
        
        <Animated.ScrollView 
          horizontal 
          bounces={false}
          style={styles.scroller} 
          ref={component => this._scrollView = component}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {nativeEvent: {contentOffset: {x: this._scrollX}}},
            ],
            {
              useNativeDriver: true,
              listener: (event) => {
                // const offsetX = event.nativeEvent.contentOffset.x
                // console.log(offsetX)
              }
            }
          )}
          onScrollEndDrag={this.onScrollEndSnapToEdge}
          // onMomentumScrollEnd={this.onScrollEndSnapToEdge}
        >
          
          <View style={styles.page}>
            <Animated.View style={[
              styles.imageWrapper,
              {
                left: WIDTH/2, 
                transform: [
                  {perspective: 5000},
                  {rotateY: leftRot},
                  {translateX: -WIDTH/2},
                ]
              },
            ]}>
              <Image 
                style={[styles.image]}
                source={{uri: items[0].url}}
              />
            </Animated.View>
          </View>

          <View style={styles.page}>
            <Animated.View style={[
              styles.imageWrapper,
              {
                right: WIDTH/2,
                transform: [
                  {perspective: 5000},
                  {rotateY: rightRot},
                  {translateX: WIDTH/2},
                ]
              },
            ]}>
              <Image 
                style={styles.image}
                source={{uri: items[1].url}}
              />
            </Animated.View>
          </View>

        </Animated.ScrollView>

        {/*<TouchableWithoutFeedback onPress={this.handleBack} disabled={loading}>
          <View style={styles.left} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.handleForward} disabled={loading}>
          <View style={styles.right} />
        </TouchableWithoutFeedback>*/}

      </View>
    );
  }

  onScrollEndSnapToEdge = event => {
    const x = event.nativeEvent.contentOffset.x;
    if (0 < x && x < WIDTH / 3) {
      if (this._scrollView.getNode()) {
        this._scrollView.getNode().scrollTo({x: 0});
      }
    } else if (WIDTH / 3 <= x && x < WIDTH) {
      if (this._scrollView.getNode()) {
        this._scrollView.getNode().scrollTo({x: WIDTH});
      }
    }
  };

  handleBack = () => {
    if(this.props.propagateTouch) {
      this.props.onReveal()
      return
    }
    let prevStep = Math.max(0, this.state.step - 1)
    this.setState({step: prevStep})
    Animated.timing(this.state.animLeft, {
      toValue: prevStep,
      duration: 2000,
    }).start();
  }

  handleForward = () => {
    if(this.props.propagateTouch) {
      this.props.onReveal()
      return
    }
    let nextStep = Math.min(this.state.items.length-1, this.state.step + 1)
    this.setState({step: nextStep})
    Animated.timing(this.state.animLeft, {
      toValue: nextStep,
      duration: 2000,
    }).start();
  }
}

const styles = StyleSheet.create({
  container: {
  },
  scroller: {
    // width: Dimensions.get('screen').width,
    // flexDirection: 'column',
    // transform: [{scale: 0.5}],
  },
  left: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0,
    width: '50%',
  },
  right: {
    position: 'absolute',
    top: 0, bottom: 0, right: 0,
    width: '50%',
  },
  page: {
    width: WIDTH,
    // overflow: 'hidden',
    padding: WIDTH*0.1,
    paddingHorizontal: WIDTH*0.2,
    backgroundColor: 'white',
    // borderWidth: 2, borderColor: 'red',
  },
  imageWrapper: {
    flex: 1,
    alignSelf: 'stretch',
    borderWidth: 6, borderColor: '#c3e',
  },
  image: {
    // width: Dimensions.get('screen').width,
    // height: Dimensions.get('screen').height,
    flex: 1,
    alignSelf: 'stretch',
    // resizeMode: 'cover',
  },
});
