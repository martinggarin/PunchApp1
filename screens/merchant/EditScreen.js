import React, {
  useCallback, useReducer, useEffect, useState,
} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { useBackHandler } from '@react-native-community/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Dialog from 'react-native-dialog';
import ProfileInput from '../../components/ProfileInput';
import DealList from '../../components/DealList';
import Colors from '../../constants/Colors';
import * as MerchantActions from '../../store/actions/merchants';

const INPUT_UPDATE = 'UPDATE';
const PASSWORD_UPDATE = 'PASSWORD_UPDATE';

const formReducer = (state, action) => {
  let updatedValues;
  let updatedValidities;
  switch (action.type) {
  case INPUT_UPDATE:
    updatedValues = action.values;
    updatedValidities = action.validities;
    break;
  case PASSWORD_UPDATE:
    return {
      ...state,
      adminPassword: action.newValue,
    };
  default:
    return state;
  }
  let formIsValid = true;
  Object.values(updatedValidities).forEach((value) => {
    if (value === false) {
      formIsValid = false;
    }
  });

  return {
    ...state,
    inputValues: updatedValues,
    inputValidities: updatedValidities,
    formIsValid,
  };
};

const EditScreen = (props) => {
  console.log('Edit');
  const [error, setError] = useState();
  const [displayHelp, setDisplayHelp] = useState(true);
  const [promptParams, setPromptParams] = useState({ visibility: false, submitAfter: false });
  const setPromptVisibility = (newValue) => {
    setPromptParams({ visibility: newValue, submitAfter: false });
  };
  const merchant = useSelector((state) => state.merchants.myMerchant);
  const [rePasswordInput, setRePasswordInput] = useState(null);

  let newMerchant;
  if (merchant.adminPassword) {
    newMerchant = false;
  } else {
    newMerchant = true;
  }

  const dispatch = useDispatch();

  let totalDeals;
  let deals = useSelector((state) => state.merchants.myDeals);
  if (deals === undefined || deals === null) {
    totalDeals = 0;
    deals = [];
  } else {
    totalDeals = deals.length;
  }

  const initialValues = {
    inputValues: {
      title: merchant.title,
      price: merchant.price,
      type: merchant.type,
      address: merchant.address,
      city: merchant.city,
    },
    inputValidities: {
      title: true,
      price: true,
      type: true,
      address: true,
      city: true,
    },
    formIsValid: true,
    adminPassword: merchant.adminPassword,
  };
  if (newMerchant) {
    initialValues.inputValues.price = '$';
    initialValues.inputValidities = {
      title: false,
      price: true,
      type: false,
      address: false,
      city: false,
    };
    initialValues.formIsValid = false;
    initialValues.adminPassword = null;
  }
  const [formState, dispatchFormState] = useReducer(formReducer, initialValues);

  if (formState.adminPassword) {
    newMerchant = false;
  }
  if (newMerchant && displayHelp) {
    setTimeout(() => Alert.alert(
      'Welcome to PunchApp!',
      'Your merchant account has been successfully created!\n\n'
            + 'When you complete your profile, use the button in the top right corner to save your information.\n\n'
            + 'You will then be prompted to enter an administrator password for managing your account.',
      [{ text: 'Okay' }],
    ), 500);
    setDisplayHelp(false);
  }

  const submitHandler = useCallback(async () => {
    console.log('-Submit Profile Handler');
    if (!formState.formIsValid) {
      Alert.alert(
        'Invalid Input!',
        'Please check your inputs...',
        [{ text: 'Okay' }],
      );
      return;
    }
    setError(null);
    try {
      await dispatch(MerchantActions.updateMerchant(
        merchant.id,
        formState.inputValues.title,
        formState.inputValues.price,
        formState.inputValues.type,
        formState.inputValues.address,
        formState.inputValues.city,
        formState.adminPassword,
      ));
      setTimeout(() => {
        props.navigation.navigate('MerchantHome');
      }, 500);
    } catch (err) {
      setError(err.message);
    }
  }, [formState, dispatch]);

  const inputChangeHandler = useCallback((inputValues, inputValidities) => {
    console.log('-Input Change Handler');
    dispatchFormState({
      type: INPUT_UPDATE,
      values: inputValues,
      validities: inputValidities,
    });
  }, [dispatchFormState]);

  const dealTapHandler = useCallback((dealCode) => {
    Alert.alert(
      deals[dealCode].reward,
      'What would you like to do?',
      [{
        text: 'Edit',
        onPress: () => {
          console.log('-Deal Edit Handler');
          props.navigation.navigate('UpdateDeal', { id: merchant.id, deals, dealCode });
        },
      }, {
        text: 'Remove',
        onPress: () => {
          console.log('-Deal Remove Handler');
          dispatch(MerchantActions.removeDeal(merchant.id, dealCode));
        },
      }, {
        text: 'Cancel',
        onPress: () => { console.log('-Cancel Pressed'); },
        style: 'cancel',
      }],
      { cancelable: true },
    );
  });

  useBackHandler(() => {
    if (newMerchant) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  useEffect(() => {
    let handlerToUse;
    if (newMerchant) {
      handlerToUse = () => {
        if (!formState.formIsValid) {
          Alert.alert(
            'Invalid Input!',
            'Please check your inputs...',
            [{ text: 'Okay' }],
          );
        } else {
          setPromptParams({ visibility: true, submitAfter: true });
        }
      };
    } else {
      handlerToUse = submitHandler;
    }
    props.navigation.setParams({
      submit: handlerToUse,
      setPromptVisibility: () => setPromptVisibility(true),
    });
  }, [submitHandler]);

  const footer = (
    <TouchableOpacity
      onPress={() => {
        console.log('-Deal Add Handler');
        if (!newMerchant) {
          props.navigation.navigate('UpdateDeal', { id: merchant.id, deals, dealCode: totalDeals });
        } else {
          Alert.alert(
            'Unable to add a deal!',
            'Please complete and save your profile information before creating any deals...',
            [{ text: 'Okay' }],
          );
        }
      }}
      style={styles.addContainer}
    >
      <View style={styles.addContainer}>
        <Ionicons name="md-add-circle" size={30} color={Colors.fontDark} />
        <Text>Add Deal</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.upperContainer}>
        <ProfileInput
          values={formState.inputValues}
          validities={formState.inputValidities}
          onInputChange={inputChangeHandler}
        />
      </View>
      <View style={styles.lowerContainer}>
        <DealList
          dealData={deals}
          onTap={dealTapHandler}
          footer={footer}
          merchantSide
        />
      </View>
      <Dialog.Container visible={promptParams.visibility}>
        <Dialog.Title style={{ fontWeight: 'bold' }}>Set Admin Password!</Dialog.Title>
        <Dialog.Description>
          Please enter a password to use for administrator access.
          You need this password to manage employees, edit profile information, and update deals...
        </Dialog.Description>
        <Dialog.Input
          style={{ borderBottomWidth: Platform.OS === 'android' ? 1 : 0, color: Colors.borderDark }}
          autoCorrect={false}
          autoCompleteType="off"
          placeholder="Administrator password"
          placeholderTextColor={Colors.placeholderText}
          onChangeText={(text) => {
            console.log('-Input Change Handler');
            dispatchFormState({
              type: PASSWORD_UPDATE,
              newValue: text,
            });
          }}
          autoCapitalize="none"
          secureTextEntry
        />
        <Dialog.Input
          style={{ borderBottomWidth: Platform.OS === 'android' ? 1 : 0, color: Colors.borderDark }}
          autoCorrect={false}
          autoCompleteType="off"
          placeholder="Confirm administrator password"
          placeholderTextColor={Colors.placeholderText}
          onChangeText={(text) => {
            console.log('-Input Change Handler');
            setRePasswordInput(text);
          }}
          autoCapitalize="none"
          secureTextEntry
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            dispatchFormState({
              type: PASSWORD_UPDATE,
              newValue: merchant.adminPassword,
            });
            setPromptVisibility(false);
          }}
        />
        <Dialog.Button
          label="Confirm"
          onPress={async () => {
            if (formState.adminPassword.length < 5) {
              Alert.alert(
                'Invalid Input!',
                'Admin password must be at least 5 characters',
                [{ text: 'Okay' }],
              );
            } else if (formState.adminPassword === rePasswordInput) {
              console.log('-Password Change Handler');
              setPromptVisibility(false);
              if (promptParams.submitAfter) {
                submitHandler();
              }
            } else {
              Alert.alert(
                'Passwords do not match!',
                'Please check password inputs',
                [{ text: 'Okay' }],
              );
            }
          }}
        />
      </Dialog.Container>
    </View>
  );
};

EditScreen.navigationOptions = (navigationData) => {
  const submit = navigationData.navigation.getParam('submit');
  const setPromptVisibility = navigationData.navigation.getParam('setPromptVisibility');
  return {
    title: 'Edit Profile',
    headerRight: () => (
      <View style={styles.headerRight}>
        <View style={styles.headerButton}>
          <MaterialIcons
            name="supervisor-account"
            size={30}
            color={Colors.lines}
            style={{ marginRight: 10 }}
            onPress={setPromptVisibility}
          />
        </View>
        <View style={styles.headerButton}>
          <Feather
            name="save"
            size={25}
            color={Colors.lines}
            style={{ marginRight: 10 }}
            onPress={submit}
          />
        </View>
      </View>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  upperContainer: {
    width: '95%',
    height: 175,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 3,
    margin: '2.5%',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
  },
  lowerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  addContainer: {
    alignItems: 'center',
    height: 150,
    margin: 10,
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButton: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EditScreen;
