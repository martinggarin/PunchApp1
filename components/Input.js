import React, { useReducer, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet,
} from 'react-native';

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';
// example props
// id='title'
// label='title'
// errorText='please enter valid text'
// initialValue={editedProduct ? editedProduct.title : ''}
// initiallyValid={!!editedProduct}
// onInputChange={inputChangeHandler}
// required
const inputReducer = (state, action) => {
  // console.log(action.type);
  switch (action.type) {
  case INPUT_CHANGE:
    // console.log(action.value);
    return {
      ...state,
      value: action.value,
      isValid: action.isValid,
    };
  case INPUT_BLUR:
    return {
      ...state,
      touched: true,
    };
  default:
    // console.log('default '+action.value);
    return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : '',
    isValid: props.initiallyValid,
    touched: false,
  });

  const lostFocusHandler = () => {
    dispatch({ type: INPUT_BLUR });
  };

  const { onInputChange, id } = props;

  // onINput change will be a function passed from parent. this will be called here every time
  // there is a change in the inputstate, which is when the text changes.
  // this will allow for the parent to remain updated on the state of the child
  useEffect(() => {
    if (inputState.touched) {
      props.onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);

  const textChangeHandler = (text) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    dispatch({ type: INPUT_CHANGE, value: text, isValid });
  };

  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props}
        style={styles.input}
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler}
      />
      {!inputState.isValid && inputState.touched && <Text>{props.errorText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: '100%',
    alignContent: 'center',
  },
  label: {
    // fontFamily: 'open-sans-bold',
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,

  },
});

export default Input;
