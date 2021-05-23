import React from 'react';
import PropTypes from 'prop-types'
import Colors from 'app/constants/Colors';
import { Platform, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Layout from 'app/constants/Layout';
// import Helpers from 'app/utilities/Helpers';

export default class Tekst extends React.Component {  
  static propTypes = {
    size: PropTypes.string,
    small: PropTypes.bool,
    large: PropTypes.bool,
    center: PropTypes.bool,
    bold: PropTypes.bool,
    color: PropTypes.string,
    // style: PropTypes.object,
  }

  static defaultProps = {
    small: false,
    large: false,
    bold: false,
    color: Colors.white,
    style: {},
  }

  render() {
    let {
      style, 
      children, 
      // size, small, large, center, color,
      ...otherProps
    } = this.props

    return (
      <Text style={[styles.text, this.formatStyle(), style]} {...otherProps}>
        {children}
      </Text>
    );
  }

  formatStyle = () => {
    let { small, large, color, center, bold } = this.props
    let style = {
      color,
    }
    if(center) style.textAlign = 'center'
    if(small){
      style.fontSize = 18
    }
    else if(large){
      style.fontSize = 30
    }
    else {
      style.fontSize = 24
    }
    if(bold){
      style.fontWeight = '700'
    }
    return style
  }
}

const styles = StyleSheet.create({
  text: {
    // fontWeight: '900',
    fontWeight: '300',
    fontFamily: Platform.OS == 'ios' ? 'Courier' : 'monospace',
  },
});