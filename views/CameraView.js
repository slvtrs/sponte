import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, TextInput, Keyboard, Alert } from 'react-native';
import { Camera, Permissions, Video } from 'expo'

import apiActions from 'app/utilities/Actions';
import RecordingShutter from 'app/components/RecordingShutter';
// import { CircularProgress } from 'app/components/CircularProgress';

export default class CameraView extends React.Component {
  constructor(){
    super()
    this.state = {
      hasCameraPermission: null,
      hasAudioPermission: null,
      type: Camera.Constants.Type.back,
      recording: false,
      videoUri: null,
    }
  }

  async componentDidMount(){
    // const { cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
    // this.setState({ hasCameraPermission: cameraStatus === 'granted' });
    let hasCameraPermission = await requestCameraPermission()
    let hasAudioPermission = await requestAudioPermission()
    this.setState({hasCameraPermission, hasAudioPermission})
    this.duration = 7
  }

  render() {
    const { hasCameraPermission } = this.state

    if (hasCameraPermission === null) {
      return <View />
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    } else if (this.state.videoUri) {
      return (
        <View style={styles.container}>
          <TouchableOpacity onPress={this.props.onCancel}>
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
          </TouchableOpacity>
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
            <View style={styles.content}>

              <View style={styles.buttonRowTop}>
                <TouchableOpacity onPress={this.props.onCancel}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      type: this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                    })
                  }}>
                  <Text style={styles.buttonText}>
                    {' '}Flip{' '}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonRowBottom}>
                <TouchableOpacity onPress={this.snap}>
                  <View style={[styles.shutterButton, this.state.recording ? styles.recording : null]} />
                </TouchableOpacity>
              </View>

            </View>

          </Camera>
        </View>
      )
    }
  }

  snap = async () => {
    if (this.camera && !this.state.recording) {
      this.setState({recording: true})
      let video = await this.camera.recordAsync({maxDuration: this.duration});
      this.props.uploadVideo(video.uri)
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
      // // let res = await apiActions.request('posts', 'POST', data, 0)

      // const data = {
      //   post: {
      //     file: video,
      //   },
      // }
      // let res = await apiActions.request('posts', 'POST', data)
      // console.log(res)

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
    paddingBottom: 40,
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
    alignItems: 'stretch',
    justifyContent: 'space-between',
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