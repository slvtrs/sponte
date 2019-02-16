import React from 'react';
import ENV from 'config/ENV'
import PropTypes from 'prop-types'
import Colors from 'app/constants/Colors';
import { Text, TouchableOpacity, TouchableWithoutFeedback, View, StyleSheet, Animated, Easing, Image, Dimensions, ScrollView, Platform } from 'react-native';
import { Video } from 'expo'

import apiActions from 'app/utilities/Actions';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const PADDING = WIDTH * 0.1
const BORDER = 0

export default class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      step: 0,
      animLeft: new Animated.Value(0),
      propagateTouch: false,
      beginX: 0,
      peakDirection: 'right',
    }    
    this._scrollX = new Animated.Value(0)
  }

  componentDidMount = async () => {
    // apiActions.getCats(5).then(cats => {
    //     // console.log(cats)
    //   this.setState({
    //     items: cats,
    //     loading: false,
    //   })
    // })
    let res = await apiActions.request('posts', 'GET', null, 4).catch(e => console.warn(e))
    // console.log(res)
    this.setState({items: res.posts})
  }

  componentDidUpdate(prevProps, prevState, snapshot){}

  render() {
    let { items, loading, step, beginX, peakDirection } = this.state
    let { propagateTouch, yOffset } = this.props

    let animBase
    let animLimit
    if(peakDirection == 'right'){
      animBase = (step) * WIDTH
      animLimit = (step+1) * WIDTH
    } else {
      animBase = (step-1) * WIDTH
      animLimit = (step) * WIDTH
    }
    
    let leftRot = this._scrollX.interpolate({
      inputRange: [animBase, animLimit],
      // outputRange: ['0deg', `-90deg`],
      outputRange: ['0deg', `60deg`],
      extrapolate: 'clamp',
    });
    let rightRot = this._scrollX.interpolate({
      inputRange: [animBase, animLimit],
      // outputRange: ['90deg', `0deg`],
      outputRange: ['-60deg', `0deg`],
      extrapolate: 'clamp',
    });
    let leftX = this._scrollX.interpolate({
      inputRange: [animBase, animLimit],
      outputRange: [0, -PADDING*2],
      extrapolate: 'clamp',
    });
    let rightX = this._scrollX.interpolate({
      inputRange: [animBase, animLimit],
      outputRange: [PADDING*2, 0],
      extrapolate: 'clamp',
    });

    if(loading) return <View />

    return (
      <View style={styles.container}>
        
        <Animated.ScrollView 
          horizontal 
          // bounces={false}
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
                const offsetX = event.nativeEvent.contentOffset.x
                // console.log(offsetX)

                // capture peakDirection
                if(beginX < offsetX && peakDirection !== 'right')
                  this.setState({peakDirection: 'right'})
                else if(beginX > offsetX && peakDirection !== 'left')
                  this.setState({peakDirection: 'left'})

                // capture onScrollEnd
                if (offsetX % WIDTH === 0){
                  const newStep = offsetX/WIDTH
                  if(step !== newStep){
                    this.setState({step: newStep})
                  }
                }
              }
            }
          )}
          onScrollBeginDrag={this.onScrollBegin}
          onScrollEndDrag={this.onScrollEndSnapToEdge}
          // onMomentumScrollEnd={console.log('ENDEND MOMENTUM')}
        >

          {items.map((item, i) => {
            const applyLeftAnim = (peakDirection == 'right' && i===step ) || 
              (peakDirection == 'left' && i === step - 1)
            const applyRightAnim = (peakDirection == 'right' && i === step + 1 ) || 
              (peakDirection == 'left' && i === step)
            return (
              <View style={styles.page} key={i}>
                <TouchableWithoutFeedback onPress={this.handleBack} disabled={false}>
                  <View style={styles.left}>
                    {/*<TouchableOpacity onPress={() => alert('avatar')}>
                      <View style={styles.avatarWrapper} />
                    </TouchableOpacity>*/}
                  </View>
                </TouchableWithoutFeedback>
                <Animated.View style={[
                  styles.imageWrapper,
                  applyLeftAnim ? {
                    left: WIDTH/2, 
                    transform: [
                      {perspective: 1000},
                      {rotateY: leftRot},
                      {translateX: -WIDTH/2},
                    ]
                  } : null,
                  applyRightAnim ? {
                    right: WIDTH/2, 
                    transform: [
                      {perspective: 1000},
                      {rotateY: rightRot},
                      {translateX: WIDTH/2},
                    ]
                  } : null,
                ]}>
                  {/*<Animated.Image 
                    source={{uri: item.url}}
                    style={[
                      styles.image,
                      // i === step ? {bottom: Math.max(0, yOffset-PADDING-BORDER)} : null
                      i === step ? {bottom: yOffset-PADDING-BORDER} : null,
                      applyLeftAnim ? {transform: [{translateX: leftX}]} : null,
                      applyRightAnim ? {transform: [{translateX: rightX}]} : null,
                    ]}
                  />*/}
                  <Video 
                    source={{uri: `${ENV.ROOT}${item.file.url}`}}
                    style={styles.video}
                    // style={[
                      // styles.image,
                      // i === step ? {bottom: yOffset-PADDING-BORDER} : null,
                      // applyLeftAnim ? {transform: [{translateX: leftX}]} : null,
                      // applyRightAnim ? {transform: [{translateX: rightX}]} : null,
                    // ]}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay
                    isLooping
                  />
                </Animated.View>
                <TouchableWithoutFeedback onPress={this.handleForward} disabled={false}>
                  <View style={styles.right} />
                </TouchableWithoutFeedback>
              </View>
            )
          })}

        </Animated.ScrollView>

        {/*<Text style={{color: 'black', fontSize: 40, position: 'absolute'}}>{peakDirection} - {step}</Text>*/}

        {propagateTouch && (
          <TouchableWithoutFeedback onPress={this.props.onReveal}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>           
        )}

      </View>
    );
  }

  onScrollBegin = event => {
    const beginX = event.nativeEvent.contentOffset.x
    this.setState({beginX})
  }

  onScrollEndSnapToEdge = event => {
    const x = event.nativeEvent.contentOffset.x;
    let { beginX, step, items } = this.state

    const dxThreshold = 50
    const dx = x - beginX
    if (dx < 0 && dx < -dxThreshold)
      step--
    else if (dx > 0 && dx > dxThreshold)
      step++

    step = Math.max(0, Math.min(items.length-1, step))
    
    // this.setState({step}, () => {
      this._scrollView.getNode().scrollTo({x: step * WIDTH})
    // })
  };

  handleBack = () => {
    const newStep = this.state.step - 1
    const beginX = newStep * WIDTH
    this.setState({beginX, peakDirection: 'left'}, () => {
      let step = Math.max(0, newStep)
      this._scrollView.getNode().scrollTo({x: step * WIDTH})      
    })
  }

  handleForward = () => {
    const newStep = this.state.step + 1
    const beginX = newStep * WIDTH
    this.setState({beginX, peakDirection: 'right'}, () => {
      let step = Math.min(this.state.items.length-1, newStep)
      this._scrollView.getNode().scrollTo({x: step * WIDTH})
    })
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  scroller: {
    // width: Dimensions.get('screen').width,
    // flexDirection: 'column',
    // transform: [{scale: 0.5}],
  },
  left: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0,
    width: WIDTH*0.2,
    // backgroundColor: 'rgba(255,0,0,0.3)',
  },
  right: {
    position: 'absolute',
    top: 0, bottom: 0, right: 0,
    width: WIDTH*0.2,
    // backgroundColor: 'rgba(0,255,0,0.3)',
  },
  page: {
    width: WIDTH,
    // overflow: 'hidden',
    paddingVertical: PADDING,
    paddingHorizontal: PADDING*2,
    backgroundColor: 'white',
    // borderWidth: 2, borderColor: 'red',
    height: HEIGHT,
  },
  imageWrapper: {
    flex: 1,
    alignSelf: 'stretch',
    borderWidth: BORDER, 
    borderColor: '#1688da',
    borderRadius: 0,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    alignSelf: 'stretch',
    resizeMode: 'cover',
    position: 'absolute',
    left: -PADDING*2, 
    right: -PADDING*2,
    bottom: -PADDING-BORDER,
    // height: HEIGHT - PADDING - BORDER,
    height: HEIGHT + BORDER*2,
    backgroundColor: 'black',
  },
  avatarWrapper: {
    position: 'absolute',
    top: PADDING,
    left: PADDING/2,
    // transform: [{translateX: '-50%'}],
    width: PADDING,
    height: PADDING,
    borderRadius: PADDING,
    backgroundColor: 'red',
  },
  video: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 100, 
    height: 200, 
    // borderWidth: 2,
    margin: 10,
    backgroundColor: 'red',
  },
});
