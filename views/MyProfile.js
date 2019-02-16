import ENV from 'config/ENV'
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, TextInput, Keyboard, Alert } from 'react-native';
import { Video } from 'expo'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import MultiSlider from '@ptomasroos/react-native-multi-slider'

import apiActions from 'app/utilities/Actions';

import Layout from 'app/constants/Layout'
import Content from 'app/constants/Content'

import CameraView from 'app/views/CameraView'
import Button from 'app/components/Button'


export default class MyProfile extends React.Component {
  constructor(){
    super()
    this.state = {
      windowOpen: moment().subtract(30,'s'),
      status: '',
      statusText: '',
      range: [9,21],
      initialRange: null,
      rawRange: null,
      bio: '',
      initialBio: '',
      edittingBio: false,
      lastMoved: null,
      cameraOpen: false,
      videos: [],
      posts: [],
    }
  }

  componentDidMount(){
    apiActions.request('profiles/self').then(res => {
      let range = (res.profile.window_start_at !== null && res.profile.window_end_at !== null) ?
        [parseInt(res.profile.window_start_at), parseInt(res.profile.window_end_at)] :
        this.state.range
      this.setState({
        bio: res.profile.bio, 
        initialBio: res.profile.bio, 
        range: range,
        rawRange: range,
        initialRange: range,
        posts: res.posts,
      })
      console.log(res.posts)
    })
  }

  submitBio = async () => {
    let { bio } = this.state
    let data = { profile: { bio: bio } }
    await apiActions.request('profiles/update', 'PUT', data).catch(e => console.warn(e))
    this.setState({edittingBio: false, bio: bio, initialBio: bio})
    Keyboard.dismiss()
  }

  submitRange = () => {
    let { range } = this.state
    let data = { profile: { window_start_at: range[0].toString(), window_end_at: range[1].toString() } }
    apiActions.request('profiles/update', 'PUT', data).catch(e => console.warn(e))
    this.setState({range: range, initialRange: range, rawRange: range})
    Alert.alert('Schedule changes will take affect at midnight.')
  }

  render() {
    let { invert, range, initialRange, bio, initialBio, edittingBio } = this.state

    if(this.state.cameraOpen){
      return (
        <View style={[styles.container, this.props.visible ? null : styles.hidden]}>
          <CameraView 
            onCancel={() => this.setState({cameraOpen: false})} 
            uploadVideo={(videoUri) => {
              let { videos } = this.state
              videos.push(videoUri)
              this.setState({videos})
            }}
          /> 
        </View>
      )
    }

    return (
      <View style={[styles.container, this.props.visible ? null : styles.hidden]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.inner}>

        <View style={styles.bioWrapper}>
          <TextInput
            style={styles.input}
            multiline={true}
            placeholder="edit bio"
            value={bio}
            onFocus={() => this.setState({edittingBio: true})}
            onChangeText={(bio) => this.setState({bio, edittingBio: true})}
            autoCorrect={false}
            autoCapitalize="none"
            onSubmitEditing={(e) => this.submitBio()}
            blurOnSubmit={true}
            underlineColorAndroid='transparent'
          />
          <View style={styles.buttonWrapper}>
            {bio != initialBio && (
              <TouchableOpacity onPress={() => this.setState({bio: this.state.initialBio})}>
                <Text style={styles.buttonText}>discard</Text>
              </TouchableOpacity>
            )}
            {edittingBio && (bio != initialBio) && (
              <TouchableOpacity onPress={this.submitBio}>
                <Text style={styles.buttonText}>save</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.postWrapper}>
          <TouchableOpacity onPress={this.handlePost}>
            <View style={styles.iconWrapper}>
              <Feather name='plus' color='green' size={100} />
            </View>
          </TouchableOpacity>
        </View>

        {/*this.state.videos.length > 0 && (
          <View style={styles.videoScrollerWrapper}>
            <ScrollView horizontal style={styles.videoScroller}>
              {this.state.videos.map((uri, i) => { return (
                <Video
                  key={i}
                  source={{uri}}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  style={styles.video}
                />
              )})}
            </ScrollView>
          </View>
        )*/}

        {this.state.posts.length > 0 && (
          <View style={styles.videoScrollerWrapper}>
            <ScrollView horizontal style={styles.videoScroller}>
              {this.state.posts.map((post, i) => { return (
                <Video
                  key={i}
                  source={{uri: `${ENV.ROOT}${post.url}`}}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  style={styles.video}
                />
              )})}
            </ScrollView>
          </View>
        )}

        <View style={styles.rangeWrapper}>
          <View style={styles.rangeTextWrapper}>
            <Text style={[styles.timeText, styles.buttonText]}>{moment().hour(range[0]).format('ha')}</Text>
            <Text style={[styles.buttonText]}>-</Text>
            <Text style={[styles.timeText, styles.buttonText]}>{moment().hour(range[1]).format('ha')}</Text>
          </View>
          <MultiSlider
            values={range}
            onValuesChangeStart={this.handleSliderStart}
            onValuesChangeFinish={this.handleSliderFinish}
            onValuesChange={this.handleSliderChange}
            min={0}
            max={24}
            step={1}
            snapped={true}
          />
          <View style={styles.buttonWrapper}>
            {range != initialRange && (
              <TouchableOpacity onPress={() => this.setState({range: this.state.initialRange})}>
                <Text style={styles.buttonText}>reset</Text>
              </TouchableOpacity>
            )}
            {(range != initialRange) && (
              <TouchableOpacity onPress={this.submitRange}>
                <Text style={styles.buttonText}>save</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  handlePost = () => {
    this.setState({cameraOpen: true})
  }

  handleSliderFinish = (rawRange) => {
    let range = this.maintainRange(this.state.range, this.state.lastMoved)
    this.setState({range})
  }
  handleSliderStart = () => {
    // console.log(res)
  }
  handleSliderChange = (rawRange) => {
    let lastMoved = rawRange[0] == this.state.rawRange[0] ? 'end_at' : 'start_at'
    let range = this.maintainRange(rawRange, lastMoved)
    this.setState({range, lastMoved, rawRange})
  }

  maintainRange = (range, lastMoved) => {
    let prevRange = this.state.range
    const windowRange = 12
    const diff = range[1] - range[0]
    if(diff < windowRange){
      if(lastMoved == 'start_at'){ // sliding start_at
        if(range[0] + windowRange > 24){
          range = [24-windowRange, 24]
        }
        else {
          range = [range[0], range[0] + windowRange]
        }
      }
      else { // sliding end_at
        if(range[1] - windowRange < 0){
          range = [0, windowRange]
        }
        else {
          range = [range[1] - windowRange, range[1]]
        }
      }
    }
    return range
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'space-around',
    // justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
    paddingBottom: 40,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...StyleSheet.absoluteFillObject,
  },
  hidden: {
    height: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  textWrapper: {
    // borderWidth: 3,
  },
  iconWrapper: {
    borderWidth: 5,
    borderColor: 'green',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '900',
    fontSize: 22,
  },
  header: {
    fontSize: 18,
    marginBottom: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  open: { color: 'green' },
  waiting: { color: 'blue' },
  closed: { color: 'red' },
  statusWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangeWrapper: {
    // flex: 1, 
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  rangeTextWrapper: {
    // alignSelf: 'stretch',
    flexDirection: 'row',
    // justifyContent: 'space-around',
    // borderWidth: 1,
  },
  timeText: {
    width: 80,
    // borderWidth: 1,
  },
  bioWrapper: {
    alignSelf: 'stretch',
    padding: 40,
    paddingBottom: 0,
  },
  postWrapper: {
    // borderWidth: 1,
  },
  buttonWrapper: {
    alignSelf: 'stretch',
    // paddingHorizontal: 20,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    // paddingHorizontal: 20,
  },
  buttonText: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  input: {
    alignSelf: 'stretch',
    minHeight: 40,
    // marginBottom: 10,
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#444',
    color: '#111',
  },
  videoScrollerWrapper: {
    alignSelf: 'stretch',
    height: 220,
  },
  videoScroller: {
    // alignSelf: 'stretch',
  },
  video: {
    width: 100, 
    height: 200, 
    // borderWidth: 2,
    margin: 10,
  },
});
