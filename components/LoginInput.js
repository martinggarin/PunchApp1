import React, { useReducer, useEffect } from 'react';
import {
  View, TextInput, Button, StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const EMAIL_INPUT_CHANGE = 'EMAIL_INPUT_CHANGE';
const PASSWORD_INPUT_CHANGE = 'PASSWORD_INPUT_CHANGE';

const loginInputReducer = (state, action) => {
  const updatedValues = state.inputValues;
  const updatedValidities = state.inputValidities;
  switch (action.type) {
  case EMAIL_INPUT_CHANGE:
    updatedValues.email = action.newValue;
    updatedValidities.email = action.isValid;
    break;
  case PASSWORD_INPUT_CHANGE:
    updatedValues.password = action.newValue;
    updatedValidities.password = action.isValid;
    break;
  default:
    return state;
  }
  return {
    ...state,
    inputValues: updatedValues,
    inputValidities: updatedValidities,
    touched: true,
  };
};

const LoginInput = (props) => {
  const initialValues = {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidities: {
      email: false,
      password: false,
    },
    touched: false,
  };

  const [inputState, dispatch] = useReducer(loginInputReducer, initialValues);

  const handleEmail = (text) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if ((text.length === 0) || !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    dispatch({ type: EMAIL_INPUT_CHANGE, newValue: text, isValid });
  };
  const handlePassword = (text) => {
    let isValid = true;
    if (text.length < 6) {
      isValid = false;
    }
    dispatch({ type: PASSWORD_INPUT_CHANGE, newValue: text, isValid });
  };

  // onInputChange will be a function passed from parent. this will be called here every time
  // there is a change in the inputstate, which is when the text changes.
  // this will allow for the parent to remain updated on the state of the child
  useEffect(() => {
    if (inputState.touched) {
      props.onInputChange(inputState.inputValues, inputState.inputValidities);
    }
  }, [inputState, props.onInputChange]);

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <View style={styles.fieldView}>
          <MaterialIcons
            name="email"
            size={20}
            color={Colors.primary}
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            placeholder="Email"
            placeholderTextColor={Colors.placeholderText}
            defaultValue={initialValues.inputValues.email}
            autoCapitalize="none"
            onChangeText={handleEmail}
          />
        </View>
        <View style={styles.fieldView}>
          <MaterialIcons
            name="lock"
            size={20}
            color={Colors.primary}
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={styles.input}
            secureTextEntry
            underlineColorAndroid="transparent"
            placeholder="Password"
            placeholderTextColor={Colors.placeholderText}
            defaultValue={initialValues.inputValues.password}
            autoCapitalize="none"
            onChangeText={handlePassword}
          />
        </View>
      </View>
      <View style={styles.lowerContainer}>
        <View style={styles.buttonContainer}>
          <Button title="LOG IN" color={(Platform.OS === 'ios') ? Colors.background : Colors.primary} onPress={props.onLogin} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="SIGN UP" color={(Platform.OS === 'ios') ? Colors.background : Colors.primary} onPress={props.onSignUp} />
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  upperContainer: {
    width: '95%',
    height: 125,
    alignItems: 'center',
    borderRadius: 1,
    margin: '2.5%',
  },
  lowerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  fieldView: {
    flexDirection: 'row',
    marginBottom: 30,
    paddingBottom: 2.5,
    borderBottomWidth: 1,
    borderColor: Colors.primary,
    width: '90%',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    height: 30,
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 5,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '40%',
    borderRadius: 5,
    backgroundColor: Colors.primary,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
  },
});

export default LoginInput;
