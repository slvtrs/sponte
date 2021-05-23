import React from 'react';
import ENV from 'config/ENV'
import PropTypes from 'prop-types'
import { LinearGradient } from 'expo';
import Colors from 'app/constants/Colors';
import { TouchableWithoutFeedback, View, StyleSheet, ScrollView } from 'react-native';
import Layout from 'app/constants/Layout';
import Helpers from 'app/utilities/Helpers';

import { Video } from 'expo'
import Tekst from 'app/components/Tekst';

export default class Button extends React.Component {  
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    height: PropTypes.number,
    emptyText: PropTypes.string,
  }

  static defaultProps = {
    items: [],
    height: 300,
    emptyText: 'No Posts Yet',
  }

  constructor(props){
    super(props)
    this.state = {
      items: props.items,
    }
  }

  componentDidUpdate(prevProps){
    let { items } = this.props
    if(prevProps.items.length !== items.length){
      this.setState({items})
    }
  }

  render() {
    let { items, } = this.state
    let { height, emptyText, } = this.props
    return (
      <View style={[styles.wrapper, {height: height+20}]}>
        <ScrollView horizontal style={styles.scroller}>
          {items.length > 0 && items.map((item, i) => { return (
            <TouchableWithoutFeedback key={i} onPress={async () => this.handlePress(item)}>
              <Video
                source={{uri: `${ENV.ROOT}${item.url}`}}
                ref={component => this[`video_${item.id}`] = component}
                rate={1.0}
                volume={1.0}
                isMuted={!item.playing}
                shouldPlay={item.playing}
                resizeMode="cover"
                isLooping
                style={[styles.video, {height, width: height/2}]}
                // resizeMode={}
                //   Video.RESIZE_MODE_STRETCH -- Stretch to fill component bounds.
                //   Video.RESIZE_MODE_CONTAIN -- Fit within component bounds while preserving aspect ratio.
                //   Video.RESIZE_MODE_COVER -- Fill component bounds while preserving aspect ratio.
              />
             </TouchableWithoutFeedback>
          )})}
          {items.length == 0 && (
            <View style={[styles.video, {height, width: height/2, padding: 10}]}>
              <Tekst color={Colors.lightCurtain}>{emptyText}</Tekst>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  handlePress = async (target) => {
    let { items } = this.state
    let item = items.find(itm => itm.id === target.id );
    let videoRef = this[`video_${target.id}`]
    let status = await videoRef.getStatusAsync()
    console.log(status)
    // console.log(item)
    // console.log(this[`video_${target.id}`])
    if(item.playing){
      item.playing = false
      // this[`video_${target.id}`].pauseAsync()
    }
    else {
      item.playing = true
      // this[`video_${target.id}`].playAsync()
    }
    this.setState({items}, () => {
      if(!item.playing)
        videoRef.playAsync()
      else
        videoRef.pauseAsync()
    })

    status = await videoRef.getStatusAsync()
    console.log(status)

    setTimeout(async () => {
      status = await videoRef.getStatusAsync()
      console.log(status)
    }, 1000)

    // videoRef.presentFullscreenPlayer()
  }
}

const styles = StyleSheet.create({
  wrapper: {
  },
  scroller: {
  },
  video: {
    margin: 10,
    backgroundColor: Colors.curtain,
    justifyContent: 'center',
    alignItems: 'center',
  },
});