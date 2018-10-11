import React from 'react';
import PropTypes from 'prop-types'
import Colors from '../constants/Colors';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../constants/Layout';

import Helpers from '../utilities/Helpers';
import Content from '../constants/Content';

export default class PostFooter extends React.Component {
  static propTypes = {
    post: PropTypes.shape({
      liked: PropTypes.bool,
      likes: PropTypes.number,
      description: PropTypes.string,
    }),
    index: PropTypes.number,
    user: PropTypes.object,
    toggleLiked: PropTypes.func,
    initialPost: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      saved: false,
      timeAgoText: this.generateTimeAgoText(props.index),
      likePrefix: props.initialPost ? '' : (props.post.prefix || Content.likePrefixes[Math.floor(Math.random()*Content.likePrefixes.length)]),
    }
  }

  render() {
    let { post, user, toggleLiked, index, initialPost } = this.props
    let { saved, timeAgoText, likePrefix } = this.state
    
    let totalLikes = post.likes + (post.liked ? 1 : 0)
    totalLikes = Helpers.toCommas(totalLikes)
    if(initialPost && !totalLikes) totalLikes = '  '

    return (
      <View style={styles.wrapper}>
        <View style={styles.row}>
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={toggleLiked} style={styles.icon}>
              <Ionicons 
                name={`ios-heart${post.liked ? '' : '-outline'}`}
                size={28}
                color={post.liked ? Colors.red : Colors.tabIconDefault}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <Ionicons 
                name={`ios-chatbubbles-outline`}
                size={28}
                color={Colors.tabIconDefault}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <Ionicons 
                name={`ios-paper-plane-outline`}
                size={28}
                color={Colors.tabIconDefault}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.iconRow, styles.iconRowRight]}>
            <TouchableOpacity onPress={() => {this.setState({saved: !saved})}} style={[styles.icon, styles.iconRight]}>
              <Ionicons 
                name={`ios-bookmark${saved ? '' : '-outline'}`}
                size={28}
                // style={[styles.icon, styles.iconRight]}
                color={Colors.tabIconDefault}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={[styles.text, {fontWeight: 'bold'}]}>
            {totalLikes} {likePrefix ? `${likePrefix} ` : ''}like{totalLikes == '1' ? '' : 's'}
          </Text>
        </View>
        <View style={[styles.row, styles.textRow]}>
          <Text style={styles.text}>
            <Text style={{fontWeight: 'bold'}}>{user.name}</Text> {post.description}
          </Text>
        </View>
        <View style={[styles.row, styles.textRow]}>
          <Text style={styles.timeAgoText}>
            {timeAgoText}
          </Text>
        </View>
      </View>
    );
  }

  generateTimeAgoText = index => {
    if(index === undefined){
      return 'JUST NOW'
    }
    if(index === 0){
      // return '30 MIN AGO'
      return "RECENTLY ENOUGH THAT THEY'RE STILL RESPONDING TO COMMENTS"
    }
    if(index === 1){
      return "RECENTLY ENOUGH THAT THEY'RE STILL LIKING COMMENTS"
    }
    let hours = index * 6
    if(hours < 24){
      return `${hours} HOURS AGO`
    }
    else if(hours == 24){
      return "FOREVER AGO, BUT THE ALOGORITHM WANTS YOU TO SEE THIS"
    }
    else {
      let days = Math.floor(hours/24)
      if(Math.random() < 0.5){
        return `${days} DAY${days > 1 ? 'S' : ''} AGO`
      }
      else {
        return "FOREVER AGO. WHERE HAVE YOU BEEN?"
      }
    }
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingBottom: Layout.basePadding,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: Layout.basePadding,
    paddingRight: Layout.basePadding,
    paddingTop: Layout.tinyPadding,
    paddingBottom: Layout.tinyPadding,
  },
  textRow: {
    justifyContent: 'flex-start',
  },
  iconRow: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: Layout.smallPadding * 2,
  },
  iconRowRight: {
    justifyContent: 'flex-end',
  },
  icon: {
    paddingRight: 10,
  },
  iconRight: {
    paddingRight: 0,
  },
  text: {
    // color: '#fff',
    // textAlign: 'center',
  },
  timeAgoText: {
    color: Colors.medGray,
    fontSize: 10,
  }
});
