import React, {
  useCallback, useEffect, useReducer, useState,
} from 'react';
import {
  View, StyleSheet, Alert, Image,
} from 'react-native';
import Dialog from 'react-native-dialog';
import { useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { ActivityIndicator } from 'react-native-paper';
import firebase from 'firebase';
import LoginInput from '../../components/LoginInput';
import HeaderButton from '../../components/HeaderButton';
import * as merchantActions from '../../store/actions/merchants';
import Colors from '../../constants/Colors';
import Apps from '../../firebaseApp';

const merchantApp = Apps.firebaseApp.merchant;
const onAuthStateChange = (callback) => firebase.auth(merchantApp).onAuthStateChanged((user) => {
  if (user) {
    callback(true);
  } else {
    callback(false);
  }
});

const INPUT_UPDATE = 'INPUT_UPDATE';
const RE_PASSWORD_UPDATE = 'RE_PASSWORD_UPDATE';
const TOKEN_UPDATE = 'TOKEN_UPDATE';

const formReducer = (state, action) => {
  let updatedValues;
  let updatedValidities;
  switch (action.type) {
  case INPUT_UPDATE:
    updatedValues = action.values;
    updatedValidities = action.validities;
    break;
  case RE_PASSWORD_UPDATE:
    return {
      ...state,
      rePassword: action.text,
    };
  case TOKEN_UPDATE:
    return {
      ...state,
      token: action.text,
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

const MerchantLoginScreen = (props) => {
  console.log('Merchant Login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [signUpError, setSignUpError] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true);
  const [promptVisibility, setPromptVisibility] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
    rePassword: '',
    token: '',
  });

  const submitHandler = useCallback(async (authenticated) => {
    console.log('-Login Handler');
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(merchantActions.getMerchant(
        formState.inputValues.email,
        formState.inputValues.password,
        authenticated,
      ));
      props.navigation.replace('MerchantHome');
      setIsNewUser(false);
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
    setIsNewUser(true);
  }, [formState]);

  const signUpHandler = useCallback(async () => {
    console.log('-Sign Up Handler');
    if (!(formState.inputValues.password === formState.rePassword)) {
      Alert.alert(
        'Passwords do not match!',
        'Please check password inputs',
        [{ text: 'Okay' }],
      );
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(merchantActions.createMerchant(
        formState.inputValues.email,
        formState.inputValues.password,
        formState.token,
      ));
      setPromptVisibility(false);
      props.navigation.replace('Edit');
    } catch (err) {
      setSignUpError(err.message);
    }
    setIsLoading(false);
  }, [formState]);

  const inputChangeHandler = useCallback((inputValues, inputValidities) => {
    console.log('-Input Change Handler');
    dispatchFormState({
      type: INPUT_UPDATE,
      values: inputValues,
      validities: inputValidities,
    });
  }, [dispatchFormState]);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setLoggedIn);
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loggedIn && !isLoading) {
      submitHandler(true);
    }
  }, [loggedIn]);

  useEffect(() => {
    if (error) {
      setTimeout(() => Alert.alert(
        'Problem signing in!',
        error,
        [{ text: 'Okay' }],
      ), 100);
    }
  }, [error]);

  useEffect(() => {
    if (signUpError) {
      setTimeout(() => Alert.alert(
        'Problem signing up!',
        signUpError,
        [{ text: 'Okay' }],
      ), 100);
    }
  }, [signUpError]);

  return (
    <View style={styles.screen}>
      <View style={styles.imageContainer}>
        <Image style={{ flex: 1, width: undefined, height: undefined }} source={require('../../assets/logo.png')} resizeMode="contain" />
      </View>
      <View style={styles.inputContainer}>
        {isNewUser && (
          <LoginInput
            onInputChange={inputChangeHandler}
            onLogin={() => {
              if (formState.formIsValid) {
                submitHandler(false);
              } else {
                Alert.alert(
                  'Invalid Input!',
                  'Please check your inputs...',
                  [{ text: 'Okay' }],
                );
              }
            }}
            onSignUp={() => {
              if (formState.formIsValid) {
                setPromptVisibility(true);
              } else {
                Alert.alert(
                  'Invalid Input!',
                  'Please check your inputs...',
                  [{ text: 'Okay' }],
                );
              }
            }}
          />
        )}
      </View>
      {/* <View style={styles.googleContainer}>
                <TouchableOpacity onPress={() => signUpHandler(true)}>
                    <View style={styles.googleButton}>
                        <Image
                            style={styles.googleLogo}
                            source={{
                                uri: 'https://pluspng.com/img-png/google-logo-png-open-2000.png'
                            }}
                        />
                        <Text  font='Roboto'>SIGN IN WITH GOOGLE</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
      {isLoading && <ActivityIndicator color={Colors.placeholderText} size="large" />}
      <Dialog.Container visible={promptVisibility}>
        <Dialog.Title style={{ fontWeight: 'bold' }}>Verification Required!</Dialog.Title>
        <Dialog.Description>
          Please re-enter your password and a valid merchant creation token
          to create a merchant account...
        </Dialog.Description>
        <Dialog.Input
          style={{ borderBottomWidth: Platform.OS === 'android' ? 1 : 0, color: Colors.borderDark }}
          autoCorrect={false}
          placeholder="Confirm password"
          placeholderTextColor={Colors.placeholderText}
          autoCompleteType="off"
          onChangeText={(text) => { dispatchFormState({ type: RE_PASSWORD_UPDATE, text }); }}
          autoCapitalize="none"
          secureTextEntry
        />
        <Dialog.Input
          style={{ borderBottomWidth: Platform.OS === 'android' ? 1 : 0, color: Colors.borderDark }}
          autoCorrect={false}
          placeholder="Token"
          placeholderTextColor={Colors.placeholderText}
          autoCompleteType="off"
          onChangeText={(text) => { dispatchFormState({ type: TOKEN_UPDATE, text }); }}
          autoCapitalize="none"
        />
        <Dialog.Button label="Cancel" onPress={() => setPromptVisibility(false)} />
        <Dialog.Button label="Confirm" onPress={() => signUpHandler()} />
      </Dialog.Container>
    </View>
  );
};
MerchantLoginScreen.navigationOptions = (navData) => ({
  headerTitle: 'Merchant',
  headerLeft: () => (
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item
        title="Menu"
        iconName="md-menu"
        onPress={() => {
          navData.navigation.toggleDrawer();
        }}
      />
    </HeaderButtons>
  ),
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  imageContainer: {
    width: '80%',
    height: '11%',
    marginTop: 20,
    marginBottom: 15,
  },
  inputContainer: {
    height: 200,
    width: '100%',
  },
  googleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 240,
    height: 40,
    borderColor: Colors.borderDark,
    borderWidth: 1,
    borderRadius: 3,
  },
  googleLogo: {
    height: 20,
    width: 20,
    marginLeft: 8,
    marginRight: 24,
  },
});

export default MerchantLoginScreen;
