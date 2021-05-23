import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, TextInput, Keyboard, Alert, ActivityIndicator, Animated, BackHandler } from 'react-native';
import { Camera, Permissions, Video } from 'expo'
import Colors from 'app/constants/Colors'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import apiActions from 'app/utilities/Actions';
import RecordingShutter from 'app/components/RecordingShutter';
// import { CircularProgress } from 'app/components/CircularProgress';
import Tekst from 'app/components/Tekst'

export default class CameraView extends React.Component {
  constructor(){
    super()
    this.state = {
      hasCameraPermission: null,
      hasAudioPermission: null,
      type: Camera.Constants.Type.front,
      recording: false,
      videoUri: null,
      countdown: 5,
      countdownAnim: new Animated.Value(3),
      // colors: [Colors.pink, Colors.yellow, Colors.blue]
      // colors: [Colors.dark, Colors.white, Colors.yellow, Colors.blue, Colors.pink]
      colors: [Colors.dark]
    }
  }

  async componentDidMount(){
    // const { cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
    // this.setState({ hasCameraPermission: cameraStatus === 'granted' });
    let hasCameraPermission = await requestCameraPermission()
    let hasAudioPermission = await requestAudioPermission()
    this.setState({hasCameraPermission, hasAudioPermission})
    this.duration = 7
    this.countdown()
    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress)
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
  }

  _handleBackPress = () => {
    this.props.onCancel()
    return true
  }

  countdown = () => {
    if(this.state.countdown > 0){
      Animated.timing(this.state.countdownAnim, {
        toValue: 0,
        duration: 1000,
        delay: 0,
      }).start((done) => {
        if(!done.finished) return
        this.setState({countdown: this.state.countdown-1})
        this.state.countdownAnim.setValue(1)
        this.countdown()
      })
    }
    else {
      this.snap()
    }
  }

  render() {
    const { hasCameraPermission, recording, countdown, colors, countdownAnim } = this.state
    let backgroundColor = countdown >= colors.length ? colors[countdown % colors.length] : colors[countdown]
    // let countdownSize = countdownAnim.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: ['3.0', '0.0'],
    // })

    if (hasCameraPermission === null) {
      return <View />
    } else if (hasCameraPermission === false) {
      return <Tekst>No access to camera</Tekst>
    } else if (this.state.videoUri) {
      return (
        <View style={styles.container}>
          {/*<TouchableOpacity onPress={this.props.onCancel}>*/}
            <Video
              source={{ uri: this.state.videoUri }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay
              isLooping
              style={styles.video}
            />
            <ActivityIndicator
              color="white"
              size="small"
              style={styles.activityIndicator}
            />
          {/*</TouchableOpacity>*/}
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <Camera 
            ref={ref => { this.camera = ref; }}
            style={styles.container} 
            type={this.state.type}
          >
            {!recording && countdown > 0 && (
              <View style={styles.content}>

                <View style={styles.countdownWrapper}>
                  <Animated.View style={{ transform: [{scale: countdownAnim}] }}>
                    <Tekst large>{countdown}</Tekst>
                  </Animated.View>
                </View>

                <View style={[styles.countdownBackground, {backgroundColor}]} />

                <View style={styles.section} />

                <TouchableOpacity onPress={this.props.onCancel} style={styles.section}>
                  <Tekst>Cancel</Tekst>
                </TouchableOpacity>

                <View style={styles.section} />

                <TouchableOpacity onPress={this.handleFlip} style={styles.section}>
                  <Tekst>
                    {' '}Flip{' '}
                    {/*this.state.type === Camera.Constants.Type.back ?
                      <MaterialIcons name={`photo`} size={20} color={Colors.white} /> :
                      <MaterialIcons name={`tag-faces`} size={20} color={Colors.white} />
                    */}
                  </Tekst>
                </TouchableOpacity>

                <View style={styles.section} />

                {/*<View style={styles.buttonRowBottom}>
                  <TouchableOpacity onPress={this.snap}>
                    <View style={[styles.shutterButton, this.state.recording ? styles.recording : null]} />
                  </TouchableOpacity>
                </View>*/}

              </View>
             )}
          </Camera>
        </View>
      )
    }
  }

  handleFlip = () => {
    this.setState({
      type: this.state.type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    })
  }

  snap = async () => {
    if (this.camera && !this.state.recording) {
      this.setState({recording: true})
      let video = await this.camera.recordAsync({maxDuration: this.duration});
      // this.props.uploadVideo(video.uri)
      this.setState({videoUri: video.uri})

      console.log(video)

      let uri = video.uri
      let uriParts = uri.split('.');
      let fileType = uriParts[uriParts.length - 1];
      let file = {
        uri: uri,
        name: `${Date.now()}.${fileType}`,
        type: `video/${fileType}`,
      }
      // console.log(file)
      const data = new FormData();
      data.append('file', file)
      let res = await apiActions.request('posts', 'POST', data, 0, true)
      
      if(res.success){
        this.props.onPostSuccess(res.post)
      }

      this.props.onCancel() 
    }
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'space-around',
    // justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
    // paddingBottom: 40,
  },
  video: {
    flex: 1,
    // ...StyleSheet.absoluteFillObject,
    paddingBottom: 40,
    width: 300,
    height: 500,
  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  buttonRowTop: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonRowBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#aaa',
    opacity: 0.5,
    marginBottom: 40,
  },
  recording: {
    backgroundColor: '#f999',
    opacity: 0.8,
  },
  buttonText: {
    padding: 10,
    fontSize: 18, 
    color: 'white',
  },
  activityIndicator: {
    position: 'absolute',
  },
  countdownWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  countdownBackground: {
    opacity: 0.4,
    ...StyleSheet.absoluteFillObject,
  },
  section: {
    // alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.white,
  }
});


async function requestCameraPermission() {
  const { Permissions } = Expo;

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(async () => {
      const { status } = await Permissions.getAsync(
        Permissions.CAMERA
      );
      resolve(status === 'granted');
    }, 5000);

    const promise = Permissions.askAsync(
      Permissions.CAMERA
    );

    promise.then(r => {
      clearTimeout(timeoutId);

      const { status } = r;
      resolve(status === 'granted');
    });
  });
}

async function requestAudioPermission() {
  const { Permissions } = Expo;

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(async () => {
      const { status } = await Permissions.getAsync(
        Permissions.AUDIO_RECORDING
      );
      resolve(status === 'granted');
    }, 5000);

    const promise = Permissions.askAsync(
      Permissions.AUDIO_RECORDING
    );

    promise.then(r => {
      clearTimeout(timeoutId);

      const { status } = r;
      resolve(status === 'granted');
    });
  });
}