import React from 'react';
import PropTypes from 'prop-types'
import { LinearGradient } from 'expo';
import Colors from '../constants/Colors';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Layout from '../constants/Layout';
import Helpers from '../utilities/Helpers';

export default class Avatar extends React.Component {  
  static propTypes = {
    user: PropTypes.object.isRequired,
    size: PropTypes.number,
  }

  static defaultProps = {
    size: 34,
  }

  render() {
    let { user, size, } = this.props
    let borderSize = size / 10
    return (
      <LinearGradient 
        colors={user.story ? [Colors.rose, Colors.orange] : ['white','white']}
        start={[1, 0]}
        end={[0.25, 0.75]}
        style={[
        styles.avatarWrapper,
        {
          width: (size + borderSize), 
          height: (size + borderSize),
          borderRadius: (size + borderSize) / 2,
        }
      ]}>
        <View style={[
          styles.avatarWrapperInner, 
          {
            backgroundColor: user.color,
            width: (size),
            height: (size),
            borderRadius: (size)/2,
          }
        ]}>
          <Text style={[
            styles.avatar,
            {fontSize: (size*0.7)},
          ]}>
            {user.name[0].toUpperCase()}
          </Text>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  avatarWrapper: {
    marginRight: Layout.smallPadding + Layout.tinyPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrapperInner: {
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    textAlign: 'center',
  },
});