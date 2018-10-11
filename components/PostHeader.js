import React from 'react';
import PropTypes from 'prop-types'
import Colors from '../constants/Colors';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../constants/Layout';
import Helpers from '../utilities/Helpers';

import Avatar from '../components/Avatar';

export default class PostHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: false,
      likes: Math.round(Math.random()*150)
    }
  }
  render() {
    let { liked, likes } = this.state
    let { user } = this.props
    return (
      <View style={styles.wrapper}>
        <View style={[styles.row, styles.textRow]}>
          <Avatar user={user} size={30} />
          <Text style={[styles.text, styles.bold]}>
            {user.name}
          </Text>
        </View>
        <View style={[styles.row, styles.rowRight]}>
          <TouchableOpacity style={styles.icon}>
            <Ionicons 
              name={`md-more`}
              size={28}
              color={Colors.tabIconDefault}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: Layout.basePadding,
    paddingRight: Layout.basePadding,
    paddingTop: Layout.medPadding,
    paddingBottom: Layout.medPadding,
  },
  rowRight: {
    justifyContent: 'flex-end',
    flex: 0,
  },
  textRow: {
    justifyContent: 'flex-start',
  },
  bold: {
    fontWeight: 'bold',
    marginRight: Layout.smallPadding,
  },
  text: {
    // color: '#fff',
    // textAlign: 'center',
    fontSize: 15,
  },
});
