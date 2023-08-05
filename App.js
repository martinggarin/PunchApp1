import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import UserReducer from './store/reducers/user';
import MerchantReducer from './store/reducers/merchants';
import PunchNavigator from './navigation/PunchNavigator';
import { NavigationContainer } from '@react-navigation/native';

const rootReducer = combineReducers({
  merchants: MerchantReducer,
  user: UserReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <PunchNavigator />
      </NavigationContainer>
    </Provider>
  );
}
