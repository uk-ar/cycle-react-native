'use strict';

import React, { PropTypes } from 'react';
import {findHandler} from './driver';
import ReactNative from 'react-native';
const {
  View,
} = ReactNative;

const PRESS_ACTION_TYPES = {
  onPress: 'press',
  onPressIn: 'pressIn',
  onPressOut: 'pressOut',
  onLongPress: 'longPress'
};

function createCycleComponent(className, actionTypes) {
  return React.createClass({
    displayName: 'Cycle' + className,
    propTypes: {
      selector: PropTypes.string.isRequired,
      payload: PropTypes.any
    },
    setNativeProps(props) {
      this._touchable.setNativeProps(props);
    },
    render() {
      const TouchableClass = ReactNative[className];
      const {selector, ...props} = this.props;

      // find all defined touch handlers
      const handlers = Object.keys(actionTypes)
        .map(name => [name, findHandler(actionTypes[name], selector)])
        .filter(([_, handler]) => !!handler)
        .reduce((memo, [name, handler]) => {
          // pass payload to event handler if defined
          memo[name] = () => handler(this.props.payload || null);
          return memo;
        }, {});


      return (
        <TouchableClass
            ref={view => this._touchable = view}
            {...props}
            {...handlers}
        >
            {this.props.children}
        </TouchableClass>
      );
    }
  });
}

export default {
  TouchableOpacity: createCycleComponent('TouchableOpacity',
                                         PRESS_ACTION_TYPES),
  TouchableWithoutFeedback: createCycleComponent('TouchableWithoutFeedback',
                                                 PRESS_ACTION_TYPES),
  TouchableHighlight: createCycleComponent('TouchableHighlight',
                                           PRESS_ACTION_TYPES),
  TouchableNativeFeedback: createCycleComponent('TouchableNativeFeedback',
                                                PRESS_ACTION_TYPES),
  createCycleComponent,
  Text: createCycleComponent('Text',
                             PRESS_ACTION_TYPES),
};
