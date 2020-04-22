import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PunchNavigator from './navigation/PunchNavigator';
import MerchantReducer from './store/reducers/merchants';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import {enableScreens} from 'react-native-screens';
import { createStackNavigator } from 'react-navigation-stack';

const rootReducer = combineReducers({
  merchants: MerchantReducer
});

const store = createStore(rootReducer);

enableScreens();

export default function App() {
  
  return (
    <Provider store={store}>
      <PunchNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
