import React from 'react';
import PropTypes from 'prop-types'
import Colors from '../constants/Colors';
import { LinearGradient } from 'expo';
import { Text, TouchableOpacity, TouchableWithoutFeedback, View, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Actions from '../utilities/Actions';

import Content from '../constants/Content';
import Helpers from '../utilities/Helpers';

import PostHeader from '../components/PostHeader';
import PostFooter from '../components/PostFooter';

export default class Post extends React.Component {
  static propTypes = {
    size: PropTypes.number,
    shadesOfGray: PropTypes.number,
    post: PropTypes.object,
    user: PropTypes.object,
    color: PropTypes.string,
    border: PropTypes.bool,
    header: PropTypes.bool,
    footer: PropTypes.bool,
    doubleTap: PropTypes.bool,
    initialPost: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    let fade = parseInt(props.index) / props.shadesOfGray
    let color = props.color || Helpers.randomColor(fade)
    this.state = {
      user: props.user || Content.users[ Math.floor(Math.random()*Content.users.length) ],
      post: {
        ...props.post,
        liked: props.liked !== undefined ? props.liked : false,
        likes: props.likes !== undefined ? props.likes : Math.round(Math.random()*150),
      },
      color: color,
      // color2: props.color2 || Helpers.randomColor(fade, color),
      color2: color,
      opacityAnim: new Animated.Value(0),
      // opacityAnim: 0,
      scaleAnim: new Animated.Value(0),
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.props.likes != prevProps.likes){
      let post = this.state.post
      post.likes = this.props.likes
      this.setState({post})
    }
  }
     

  render() {
    let { user, post, color, color2 } = this.state
    let { index, shadesOfGray, view, border, doubleTap, initialPost } = this.props
    return (
      <View style={border ? styles.border : null}>
        {this.props.header && <PostHeader user={user} />}
        <TouchableWithoutFeedback onPress={doubleTap ? this.handlePress : null}>
          <LinearGradient 
            colors={[color, color2]} 
            style={[
              styles.wrapper,
              {
                width: this.props.size, 
                height: this.props.size,
                padding: this.props.size/10,
              },
            ]}
          >
            <Text style={[
              styles.text,
              { fontSize: this.props.size/10 },
            ]}>
              {post.text}
              {/*`\n${color}`*/}
              {/*`\n${color2}`*/}
            </Text>
            <Animated.View style={[
              styles.likedAnim, 
              {
                opacity: this.state.opacityAnim,
                transform: [
                  {scale: this.state.scaleAnim},
                ],
              }
            ]}>
              <Ionicons name={`ios-heart`} size={80} color={'#f0f0f0'} style={styles.icon} />
            </Animated.View>
          </LinearGradient>
        </TouchableWithoutFeedback>
        {this.props.footer && <PostFooter user={user} post={post} toggleLiked={this.handleToggleLiked} index={index} initialPost={initialPost} />}
      </View>
    );
  }

  handleToggleLiked = () => {
    let { post } = this.state
    post.liked = !post.liked
    this.setState({post})
    if(this.props.initialPost){
      if(post.liked){
        Actions.addLike()
      }
      else {
        Actions.removeLike()
      }
    }
  }

  handlePress = e => {
    const DOUBLE_PRESS_DELAY = 300;
    const now = new Date().getTime();
    // console.log(e);
    if (this.lastImagePress && (now - this.lastImagePress) < DOUBLE_PRESS_DELAY) {
      delete this.lastImagePress;
      this.handleDoublePress(e);
    }
    else {
      this.lastImagePress = now;
    }
  }

  handleDoublePress(e) {
    let { post } = this.state
    if(!post.liked && this.props.initialPost){
      Actions.addLike()
    }
    post.liked = true
    this.likedAnimation()
    this.setState({post})
  }

  likedAnimation(){
    const dur = 500
    // this.setState({opacityAnim: 1})
    Animated.timing(this.state.scaleAnim, {
      toValue: 1,
      duration: dur,
      easing: Easing.bounce,
    }).start();
    Animated.timing(this.state.opacityAnim, {
      toValue: 0.9,
      duration: dur/2,
      easing: Easing.bounce,
    }).start();
    setTimeout(() => {
      Animated.timing(this.state.scaleAnim, {
        toValue: 0,
        duration: dur * 0.5,
        easing: Easing.linear,
      }).start(() => {
        // this.setState({opacityAnim: 0})
      });
      Animated.timing(this.state.opacityAnim, {
        toValue: 0,
        duration: dur * 0.5,
        easing: Easing.linear,
      }).start();
    }, dur * 2)
  }
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgb(126,126,126)',
  },
  border: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'white',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  likedAnim: {
    position: 'absolute',
    opacity: 0,
    transform: [
      {scale: 0},
    ],
  },
  icon: {
    textShadowColor: 'rgba(100, 100, 100, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 8,
    padding: 10,
  }
});
