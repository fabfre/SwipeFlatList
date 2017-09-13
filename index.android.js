/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, View} from 'react-native';
import SwipeableList from './components/SwipeableList';
import listData from './components/Data';

export default class SwipeFlatList extends Component {
  render() {
    return (
      <View style={styles.container}>
        <SwipeableList style={styles.list} data={listData} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  list: {
    flex: 1,
    marginTop: 32,
  },
});

AppRegistry.registerComponent('SwipeFlatList', () => SwipeFlatList);
