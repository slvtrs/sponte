import React from 'react';
import PropTypes from 'prop-types'
import { LinearGradient } from 'expo';
import Colors from 'app/constants/Colors';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Layout from 'app/constants/Layout';
import Helpers from 'app/utilities/Helpers';
import Tekst from 'app/components/Tekst';

export default class Button extends React.Component {  
  static propTypes = {
    onPress: PropTypes.func,
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
        disabled={!onPress}
        style={[
          styles.button,
          pill ? styles.pill : null,
        ]}
      >
        <Tekst bold>
          {this.props.children}
        </Tekst>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    // borderWidth: 1,
    padding: 12,
  },
  pill: {
    borderRadius: 28,
  },
});