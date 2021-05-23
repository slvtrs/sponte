import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, TextInput, Keyboard, Alert } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import Colors from 'app/constants/Colors';
import Layout from 'app/constants/Layout'
import Content from 'app/constants/Content'

import apiActions from 'app/utilities/Actions';

import Tekst from 'app/components/Tekst'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import Button from 'app/components/Button'
import PostScroller from 'app/components/PostScroller'


export default class MyProfile extends React.Component {
  constructor(){
    super()
    this.state = {
      status: '',
      statusText: '',
      range: [8,20],
      invertWindow: false,
      initialRange: null,
      initialInvertWindow: false,
      rawRange: null,
      bio: '',
      initialBio: '',
      edittingBio: false,
      lastMoved: 'start_at',
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
        invertWindow: res.profile.invert_window,
        initialInvertWindow: res.profile.invert_window,
        posts: res.posts,
      })
      let lastPostAt = res.posts && res.posts.length > 0 ? 
        moment(res.posts[res.posts.length-1].created_at) :
        moment().subtract(2,'d')
      this.props.setLastPostAt(lastPostAt)
      // this.props.setFirstVisit(res.ftue)
      let ftue = res.posts.length === 0
      ftue = true
      this.props.setFirstVisit(ftue)
    })
  }

  submitBio = async () => {
    let { bio } = this.state
    let data = { profile: {bio} }
    await apiActions.request('profiles/update', 'PUT', data).catch(e => console.warn(e))
    this.setState({edittingBio: false, bio: bio, initialBio: bio})
    Keyboard.dismiss()
  }

  submitRange = () => {
    let { range, invertWindow } = this.state
    let data = { profile: { 
      window_start_at: range[0].toString(), 
      window_end_at: range[1].toString(),
      invert_window: invertWindow,
    } }
    apiActions.request('profiles/update', 'PUT', data).catch(e => console.warn(e))
    this.setState({range: range, initialRange: range, rawRange: range})
    Alert.alert('Schedule changes will take affect at midnight.')
  }

  render() {
    let { posts, invert, range, initialRange, invertWindow, bio, initialBio, edittingBio } = this.state
    let { visible } = this.props

    return (
      <View style={[styles.container, visible ? null : styles.hidden]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.inner}>

        <View style={styles.bioWrapper}>
          <TextInput
            style={styles.input}
            multiline={true}
            placeholder="Edit Bio"
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
                <Tekst small style={styles.buttonText}>discard</Tekst>
              </TouchableOpacity>
            )}
            {edittingBio && (bio != initialBio) && (
              <TouchableOpacity onPress={this.submitBio}>
                <Tekst small style={styles.buttonText}>save</Tekst>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <PostScroller items={visible ? posts : []} height={220} />

        {/*<View style={styles.postWrapper}>
          <TouchableOpacity onPress={this.handlePost}>
            <View style={styles.iconWrapper}>
              <Ionicons name='ios-add-circle' color={Colors.pink} size={120} />
            </View>
          </TouchableOpacity>
        </View>*/}

        <View style={styles.rangeWrapper}>
          <View style={styles.rangeTextWrapper}>
            <Tekst small style={[styles.timeText, styles.buttonText, {textAlign: 'right'}]}>{moment().hour(range[0]).format('ha')}</Tekst>
            <Tekst small style={[styles.buttonText]}>-</Tekst>
            <Tekst small style={[styles.timeText, styles.buttonText, {textAlign: 'left'}]}>{moment().hour(range[1]).format('ha')}</Tekst>
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
            markerStyle={{backgroundColor: Colors.pink}}
            selectedStyle={{backgroundColor: invertWindow ? Colors.white : Colors.pink}}
            trackStyle={{backgroundColor: invertWindow ? Colors.pink : Colors.white}}
          />
          <View style={styles.buttonWrapper}>
            {range != initialRange && (
              <TouchableOpacity onPress={() => this.setState({range: this.state.initialRange, invertWindow: this.state.initialInvertWindow})}>
                <Tekst small style={styles.buttonText}>reset</Tekst>
              </TouchableOpacity>
            )}
            {(range != initialRange) && (
              <TouchableOpacity onPress={this.invertWindow}>
                <Tekst small style={styles.buttonText}>invert</Tekst>
              </TouchableOpacity>
            )}
            {(range != initialRange) && (
              <TouchableOpacity onPress={this.submitRange}>
                <Tekst small style={styles.buttonText}>save</Tekst>
              </TouchableOpacity>
            )}
          </View>
        </View>

          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  invertWindow = () => {
    let { range, invertWindow, lastMoved } = this.state
    invertWindow = !invertWindow
    this.setState({invertWindow}, () => {
      range = this.maintainRange(range, lastMoved)
      this.setState({range})
    })
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
    let invertWindow = this.state.invertWindow
    const windowRange = 12
    if(invertWindow){
      let fromMidnight = 24 - range[1]
      let diff = fromMidnight + range[0]
      if(diff < windowRange){
        if(lastMoved == 'start_at'){ // sliding start_at
          range = [range[0], Math.min(24, (24 + range[0] - windowRange))]
        }
        else { // sliding end_at
          range = [windowRange - fromMidnight, range[1]]
        }
      }      
    }
    else {
      diff = range[1] - range[0]
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
    }
    return range
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.yellow,
    ...StyleSheet.absoluteFillObject,
    paddingBottom: 40,
    paddingTop: 40,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingVertical: 50,
    // paddingBottom: 100,
    ...StyleSheet.absoluteFillObject,
    top: 100,
    bottom: 100,
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
    // borderWidth: 3,
  },
  rangeTextWrapper: {
    // alignSelf: 'stretch',
    flexDirection: 'row',
    // justifyContent: 'space-around',
    // borderWidth: 1,
  },
  timeText: {
    // width: 80,
    flex: 1,
  },
  bioWrapper: {
    alignSelf: 'stretch',
    // padding: 40,
    // paddingBottom: 0,
  },
  postWrapper: {
    // borderWidth: 1,
    margin: 20,
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
    // padding: 20,
    // borderBottomWidth: 1,
    borderColor: Colors.white,
    fontWeight: '900',
    fontSize: 30,
    color: Colors.white,
    textAlign: 'center',
  },
});
