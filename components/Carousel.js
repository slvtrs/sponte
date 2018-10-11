import React from 'react';
import PropTypes from 'prop-types'
import Colors from '../constants/Colors';
import { LinearGradient } from 'expo';
import { Text, TouchableOpacity, TouchableWithoutFeedback, View, StyleSheet, Animated, Easing, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Actions from '../utilities/Actions';

import Content from '../constants/Content';
import Helpers from '../utilities/Helpers';

export default class Carousel extends React.Component {
  // static propTypes = {}

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      step: 0,
      animLeft: new Animated.Value(0),
      propagateTouch: false,
    }
  }

  componentDidMount(){
    Actions.getCats(5).then(cats => {
      this.setState({
        items: cats,
        loading: false,
      })
    })

    // setInterval(() => {
    //   let ref = this._imgWrapper;
    //   this._img.measureLayout(
    //     findNodeHandle(ref), 
    //     (x,y,width,height) => {
    //       const layout = { x, y, width, height }
    //       this.setState({layout})
    //     }, 
    //     (error) => console.warn(error)
    //   )
    // }, 500)
  }

  componentDidUpdate(prevProps, prevState, snapshot){
  }

  render() {
    let { items, animLeft, loading, step } = this.state
    
    let left = items.length === 0 ? 0 : 
      animLeft.interpolate({
        inputRange: [0, items.length-1],
        outputRange: ['0%', `-${(items.length-1)*100}%`],
        extrapolate: 'clamp',
      });
    let leftRot = items.length === 0 ? 0 : 
      animLeft.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', `90deg`],
        extrapolate: 'clamp',
      });
    let rightRot = items.length === 0 ? 0 : 
      animLeft.interpolate({
        inputRange: [0, 1],
        outputRange: ['-90deg', `0deg`],
        extrapolate: 'clamp',
      });

    if(loading) return <View />
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.slider, 
            { left: left }
          ]}
        >
          <Animated.View key='0' style={[
            styles.imageWrapper,
            // {transform: [
            //   {perspective: -600},
            //   {rotateY: leftRot}
            // ]},
          ]}>
            <View>
            <View 
              style={[
                styles.image,
                {
                  // position: 'absolute',
                  // right: 0,
                  // left: 50,
                  backgroundColor: 'green',
                //   marginLeft: Dimensions.get('screen').width,
                //   transform: [
                //   {translateX: -Dimensions.get('screen').width},
                  // ]
                }
              ]}
              // source={{uri: items[0].url}}
            />
            </View>
          </Animated.View>
          <Animated.View key='1' style={[
            styles.imageWrapper,
            // {position: 'absolute', left: '100%', right: 0}
            // {transform: [
            //   {perspective: -600},
            //   {rotateY: rightRot}
            // ]},
          ]}>
            <Image 
              style={[
                styles.image,
                {
                  // marginRight: Dimensions.get('screen').width,
                  // transform: [
                  //   {translateX: Dimensions.get('screen').width},
                  // ]
                }
              ]}
              source={{uri: items[1].url}}
            />
          </Animated.View>

        </Animated.View>
        <TouchableWithoutFeedback onPress={this.handleBack} disabled={loading}>
          <View style={styles.left} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.handleForward} disabled={loading}>
          <View style={styles.right} />
        </TouchableWithoutFeedback>

        <View style={{position: 'absolute', top: 0, backgroundColor: 'black'}}>
          <Text style={{color: 'red', fontSize: 80}}>{this.state.step}</Text>
        </View>
      </View>
    );
  }

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
    flex: 1,
    alignSelf: 'stretch',
    transform: [{scale: 0.5}],
  },
  slider: {
    // position: 'absolute',
    position: 'relative',
    top: 0,
    bottom: 0,
    left: 0,
    // width: '300%',
    width: Dimensions.get('screen').width,
    flexDirection: 'row',
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
  image: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    // resizeMode: 'cover',
  },
  imageWrapper: {
    // transform: [{perspective: 600}],
    // position: 'absolute',
    top: 0,
    bottom: 0,
    width: Dimensions.get('screen').width,
    borderWidth: 2, borderColor: 'red',
    overflow: 'hidden',
  }
});
