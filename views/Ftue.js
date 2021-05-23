import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

import moment from 'moment';
import Layout from 'app/constants/Layout'
import Content from 'app/constants/Content'
import Colors from 'app/constants/Colors'

const HEIGHT = Dimensions.get('window').height
import apiActions from 'app/utilities/Actions';

import Tekst from 'app/components/Tekst';
import Button from 'app/components/Button'

export default class Ftue extends React.Component {

  constructor(){
    super()
    this.state = {
      step: 0,
      // colors: [Colors.blue, Colors.pink, Colors.yellow]
      colors: [Colors.dark]
    }
  }

  componentDidMount = async () => {
    // let res = await apiActions.request('posts', 'GET', null, 4).catch(e => console.warn(e))
    // let items = res.posts
    // this.setState({
    //   items,
    //   loading: false,
    // })
    // if(items.length){
    //   let otherId = items[0].profile_id
    //   this.props.setOtherId(otherId)
    // }
  }
    
  render() {
    let { step, colors } = this.state
    let backgroundColor = step >= colors.length ? colors[step % colors.length] : colors[step]

    return (
      <View style={[styles.container, {backgroundColor}]}>
        <Tekst color={Colors.white} center>{this.renderText()}</Tekst>
        <View style={styles.buttonWrapper}>
          {/*<Button onPress={this.onPressContinue}>Continue</Button>*/}
          <Button onPress={this.props.onBegin}>Show Us</Button>
        </View>
      </View>
    );
  }

  renderText = () => {
    return "Don't fix Your hair\n\nDon't adjust Your angle\n\nWe're here to see You in this unfiltered moment\n\nJust show Us, what's up?"
    // return "If you want a glimpse into the unfiltered lives of others, you first need to let them peer into your boring ass life."
    // return "oh great, you too?\n\nwell, we actually are sort of lacking content right now...\n\nfine if you generate some original content then you can lurk for a while."
    switch(this.state.step){
      case 0: return "First of all, thanks for being here."
      case 1: return "Ok now ready?"
      case 2: return "Here's how this works."
      case 3: return "Blah blah blah"
      case 4: return "And don't worry about how lame you look right now. Spontaneous, unfilitered humans are what Spoofy is all about."
      case 5: return "Coutndown!"
      default: return ""
    }
  }

  onPressContinue = () => {
    this.setState({step: this.state.step + 1})
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    ...StyleSheet.absoluteFillObj,
    padding: 16,
    padding: 24,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 32,
  },
});
