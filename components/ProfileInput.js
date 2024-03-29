import React, { useReducer, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, Platform, Picker, ActionSheetIOS, TouchableOpacity,
} from 'react-native';

import Colors from '../constants/Colors';

const TITLE_INPUT_CHANGE = 'TITLE_INPUT_CHANGE';
const PRICE_INPUT_CHANGE = 'PRICE_INPUT_CHANGE';
const TYPE_INPUT_CHANGE = 'TYPE_INPUT_CHANGE';
const ADDRESS_INPUT_CHANGE = 'ADDRESS_INPUT_CHANGE';
const CITY_INPUT_CHANGE = 'CITY_INPUT_CHANGE';

const profileInputReducer = (state, action) => {
  const updatedValues = state.inputValues;
  const updatedValidities = state.inputValidities;
  switch (action.type) {
  case TITLE_INPUT_CHANGE:
    updatedValues.title = action.newValue;
    updatedValidities.title = action.isValid;
    break;
  case PRICE_INPUT_CHANGE:
    updatedValues.price = action.newValue;
    updatedValidities.price = action.isValid;
    break;
  case TYPE_INPUT_CHANGE:
    updatedValues.type = action.newValue;
    updatedValidities.type = action.isValid;
    break;
  case ADDRESS_INPUT_CHANGE:
    updatedValues.address = action.newValue;
    updatedValidities.address = action.isValid;
    break;
  case CITY_INPUT_CHANGE:
    updatedValues.city = action.newValue;
    updatedValidities.city = action.isValid;
    break;
  default:
    return { state };
  }
  return {
    ...state,
    inputValues: updatedValues,
    inputValidities: updatedValidities,
    touched: true,
  };
};

ProfileInput = (props) => {
  const prices = ['$', '$$', '$$$', '$$$$'];
  const initialValues = {
    inputValues: props.values,
    inputValidities: props.validities,
    touched: false,
  };
  const [inputState, dispatch] = useReducer(profileInputReducer, initialValues);

  const handleTitle = (text) => {
    let isValid = true;
    if (text.length === 0) {
      isValid = false;
    }
    dispatch({
      type: TITLE_INPUT_CHANGE, values: inputState.inputValues, newValue: text, isValid,
    });
  };
  const handlePrice = (text) => {
    let isValid = true;
    if (text.length === 0) {
      isValid = false;
    }
    dispatch({
      type: PRICE_INPUT_CHANGE, values: inputState.inputValues, newValue: text, isValid,
    });
  };
  const handleType = (text) => {
    let isValid = true;
    if (text.length === 0) {
      isValid = false;
    }
    dispatch({
      type: TYPE_INPUT_CHANGE, values: inputState.inputValues, newValue: text, isValid,
    });
  };
  const handleAddress = (text) => {
    let isValid = true;
    if (text.length === 0) {
      isValid = false;
    }
    dispatch({
      type: ADDRESS_INPUT_CHANGE, values: inputState.inputValues, newValue: text, isValid,
    });
  };
  const handleCity = (text) => {
    let isValid = true;
    if (text.length === 0) {
      isValid = false;
    }
    dispatch({
      type: CITY_INPUT_CHANGE, values: inputState.inputValues, newValue: text, isValid,
    });
  };

  useEffect(() => {
    if (inputState.touched) {
      props.onInputChange(inputState.inputValues, inputState.inputValidities);
    }
  }, [inputState, props.onInputChange]);

  return (
    <View style={styles.container}>
      <View style={styles.rowView}>
        <View style={styles.singleFieldView}>
          <Text style={styles.text}>Merchant Title</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Merchant Title"
              placeholderTextColor={Colors.darkLines}
              defaultValue={initialValues.inputValues.title}
              autoCapitalize="none"
              onChangeText={handleTitle}
            />
          </View>
        </View>
      </View>
      <View style={styles.rowView}>
        <View style={styles.leftFieldView}>
          <Text style={styles.text}>Type</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Merchant Type"
              placeholderTextColor={Colors.darkLines}
              defaultValue={initialValues.inputValues.type}
              autoCapitalize="none"
              onChangeText={handleType}
            />
          </View>
        </View>
        <View style={styles.rightFieldView}>
          <Text style={styles.text}>Price</Text>
          {Platform.OS === 'android' && (
            <View style={styles.inputView}>
              <Picker
                selectedValue={initialValues.inputValues.price}
                onValueChange={handlePrice}
              >
                <Picker.Item label="$" value="$" />
                <Picker.Item label="$$" value="$$" />
                <Picker.Item label="$$$" value="$$$" />
                <Picker.Item label="$$$$" value="$$$$" />
              </Picker>
            </View>
          )}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.inputView}
              onPress={() => {
                ActionSheetIOS.showActionSheetWithOptions(
                  {
                    options: ['Cancel', '$', '$$', '$$$', '$$$$'],
                    title: 'Price',
                    cancelButtonIndex: 0,
                  },
                  (buttonIndex) => {
                    if (buttonIndex === 0) {
                      // cancel action
                    } else {
                      handlePrice(prices[buttonIndex - 1]);
                    }
                  },
                );
              }}
            >
              <Text style={styles.input}>{inputState.inputValues.price}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.rowView}>
        <View style={styles.leftFieldView}>
          <Text style={styles.text}>Address</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Address"
              placeholderTextColor={Colors.darkLines}
              defaultValue={initialValues.inputValues.address}
              autoCapitalize="none"
              onChangeText={handleAddress}
            />
          </View>
        </View>
        <View style={styles.rightFieldView}>
          <Text style={styles.text}>City</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="City, State"
              placeholderTextColor={Colors.darkLines}
              defaultValue={initialValues.inputValues.city}
              autoCapitalize="none"
              onChangeText={handleCity}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
  },
  rowView: {
    flexDirection: 'row',
    height: 45,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    // borderColor: Colors.borderDark,
  },
  singleFieldView: {
    width: '100%',
  },
  leftFieldView: {
    marginRight: '2.5%',
    width: '57.5%',
  },
  rightFieldView: {
    marginLeft: '2.5%',
    width: '37.5%',
  },
  inputView: {
    flex: 1,
    marginLeft: 2,
    marginRight: 2,
    borderColor: Colors.borderDark,
    borderBottomWidth: 1,
    justifyContent: 'center',
    paddingBottom: 5,
  },
  input: {
    color: Colors.fontDark,
    marginLeft: 5,
  },
  text: {
    fontWeight: 'bold',
  },
});

export default ProfileInput;
