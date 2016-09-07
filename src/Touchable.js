'use strict';

import React, { PropTypes } from 'react';
import { findHandler } from './driver';
import ReactNative from 'react-native';
const {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableNativeFeedback,
  Text,
  TextInput,
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
      const TouchableClass = className;
      const {selector, ...props} = this.props;
      if(!actionTypes && TouchableClass.propTypes){
        actionTypes={}
        Object.keys(TouchableClass.propTypes)
              .filter((key)=>key.startsWith("on"))
              .forEach((key)=>actionTypes[key]=
                `${key.charAt(2).toLowerCase()}${key.slice(3)}`);
      }

      // find all defined touch handlers
      const handlers = Object.keys(actionTypes)
        .map(name => [name, findHandler(actionTypes[name], selector)])
        .filter(([_, handler]) => !!handler)
        .reduce((memo, [name, handler]) => {
          // pass payload to event handler if defined
          memo[name] = (...args) => handler(this.props.payload === undefined ?
                                            args : this.props.payload);
          return memo;
        }, {});

      return (
        <TouchableClass
          ref={view => {
              this._touchable = view;
              findHandler("my", selector)(view)
            }}
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
  createCycleComponent: createCycleComponent,
  PRESS_ACTION_TYPES: PRESS_ACTION_TYPES,
  TouchableOpacity: createCycleComponent(TouchableOpacity,
                                         PRESS_ACTION_TYPES),
  TouchableWithoutFeedback: createCycleComponent(TouchableWithoutFeedback,
                                                 PRESS_ACTION_TYPES),
  TouchableHighlight: createCycleComponent(TouchableHighlight,
                                           PRESS_ACTION_TYPES),
  TouchableNativeFeedback: createCycleComponent(TouchableNativeFeedback,
                                                PRESS_ACTION_TYPES),
  Text: createCycleComponent(Text,
                             PRESS_ACTION_TYPES),
  TextInput: createCycleComponent(TextInput),
};
