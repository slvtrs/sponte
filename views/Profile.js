import React from 'react';
import PropTypes from 'prop-types'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import apiActions from 'app/utilities/Actions';
import Layout from 'app/constants/Layout'
import Content from 'app/constants/Content'
import Colors from 'app/constants/Colors'
import Tekst from 'app/components/Tekst'
import Button from 'app/components/Button'
import PostScroller from 'app/components/PostScroller'

export default class Profile extends React.Component {

  static propTypes = {
    id: PropTypes.number,
  }

  constructor(props){
    super(props)
    this.state = {
      bio: '',
      posts: [],
    }
  }

  componentDidUpdate(prevProps){
    let { id, visible } = this.props
    if(prevProps.visible != visible && visible && id){
      this.fetchProfile(id)
    }
    else if(prevProps.id != id){
      console.log('clearing other profile')
      this.setState({bio: '', posts: []})
    }
  }

  fetchProfile = async (id) => {
    let res = await apiActions.request(`profiles/${id}`).catch(e => console.warn(e))
    // console.log('new profile', res.profile.bio)
    this.setState({
      bio: res.profile.bio, 
      posts: res.posts,
    })
  }

  render() {
    let { id, feedExpired } = this.props
    let { bio, posts } = this.state
    
    // if(!bio && posts.length == 0){
    //   return (
    //     <View style={[styles.container, this.props.visible ? null : styles.hidden]} />
    //   )
    // }

    if(feedExpired){
      return (
        <View style={[styles.container, this.props.visible ? null : styles.hidden]}>
          <Button onPress={this.props.onHide}>Return</Button>
        </View>
       )
    }

    return (
      <View style={[styles.container, this.props.visible ? null : styles.hidden]}>
        <Button>{bio.length > 0 ? `"${bio}"` : ' '}</Button>
        {id === 0 && <PostScroller items={posts} emptyText={null} />}
        {id !== 0 && <PostScroller items={posts} />}
        <Button onPress={this.props.onHide}>Return</Button>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  hidden: {
    height: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
  },
});
