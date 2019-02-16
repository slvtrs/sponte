import React from 'react';
import PropTypes from 'prop-types'
import { LinearGradient } from 'expo';
import Colors from '../constants/Colors';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Layout from '../constants/Layout';
import Helpers from '../utilities/Helpers';

export default class Button extends React.Component {  
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    pill: PropTypes.bool,
  }

  static defaultProps = {
    pill: true,
  }

  render() {
    let { pill, onPress, } = this.props
    return (
      <TouchableOpacity 
        onPress={onPress} 
        style={[
          styles.button,
          pill ? styles.pill : null,
        ]}
      >
        <Text style={styles.text}>
          {this.props.children}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    padding: 12,
  },
  pill: {
    borderRadius: 28,
  },
  text: {
    // 
  },
});