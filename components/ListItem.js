import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  TouchableHighlight,
} from 'react-native';

const {width} = Dimensions.get('window');

export default class ListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onRowPressed = this.onRowPressed.bind(this);
    this.onActionPressed = this.onActionPressed.bind(this);

    this.gestureDelay = -35;
    this.expandedWidth = 80;
    this.scrollViewEnabled = true;
    this.toggleExpanded = false;

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) > 5) {
          return true;
        }
        return false;
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 35) {
          this.setScrollViewEnabled(false);
          let newX = gestureState.dx + this.gestureDelay;
          if (this.toggleExpanded) {
            newX += this.expandedWidth;
          }
          position.setValue({x: newX, y: 0});
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (
          (!this.toggleExpanded && gestureState.dx < 150) ||
          (this.toggleExpanded && gestureState.dx < 50)
        ) {
          this.animate(0, 0, 150, () => {
            this.setScrollViewEnabled(true);
          });
        } else {
          this.animate(width, 0, 300, () => {
            this.props.success(this.props.text);
            this.setScrollViewEnabled(true);
          });
        }
      },
    });

    this.panResponder = panResponder;
    this.state = {position};
  }

  setScrollViewEnabled(enabled) {
    if (this.scrollViewEnabled !== enabled) {
      this.props.setScrollEnabled(enabled);
      this.scrollViewEnabled = enabled;
    }
  }

  onRowPressed() {
    this.setScrollViewEnabled(false);
    if (this.toggleExpanded) {
      this.animate(0, 0, 150, () => {
        this.setScrollViewEnabled(true);
      });
    } else {
      this.animate(this.expandedWidth, 0, 150, () => {
        this.setScrollViewEnabled(true);
      });
    }
    this.toggleExpanded = !this.toggleExpanded;
  }

  animate(x, y, duration, callback) {
    Animated.timing(this.state.position, {
      toValue: {x: x, y: y},
      duration: duration,
    }).start(callback);
  }

  onActionPressed() {
    this.setScrollViewEnabled(false);
    this.animate(width, 0, 400, () => {
      this.props.success(this.props.text);
      this.setScrollViewEnabled(true);
    });
  }

  render() {
    return (
      <View style={styles.listItem}>
        <Animated.View style={[this.state.position.getLayout()]} {...this.panResponder.panHandlers}>
          <TouchableHighlight
            style={styles.absoluteCell}
            underlayColor={'red'}
            onPress={this.onActionPressed}
          >
            <Text style={styles.absoluteCellText}>DELETE</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.innerCell}
            underlayColor={'yellow'}
            onPress={this.onRowPressed}
          >
            <Text>
              {this.props.text}
            </Text>
          </TouchableHighlight>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    height: 80,
    marginLeft: -100,
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  absoluteCell: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  absoluteCellText: {
    margin: 16,
    color: '#FFF',
  },
  innerCell: {
    width: width,
    height: 80,
    marginLeft: 100,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
