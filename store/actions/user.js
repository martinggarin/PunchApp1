import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import Customer from '../../models/Customer';
import RewardStatus from '../../models/RewardsStatus';

import Apps from '../../firebaseApp';

export const CREATE_USER = 'CREATE_USER';
export const GET_USER = 'GET_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const UPDATE_RS = 'UPDATE_RS';

const userApp = Apps.firebaseApp.user;
const merchantApp = Apps.firebaseApp.merchant;

export const createUser = (email, password, useGoogle) => {
  console.log('~User Action: createUser');
  return async (dispatch) => {
    let credential = null;
    let googleUser = null;
    const accountExists = false;

    if (useGoogle) {
      googleUser = await Google.logInAsync({
        androidClientId: '685510681673-falsomf7g38i1d2v957dksi672oa75pa.apps.googleusercontent.com',
        iosClientId: '685510681673-223e0ep20l00k03mf5fes84ojhdkjhr1.apps.googleusercontent.com',
      });
      if (googleUser.type === 'success') {
        const authenticatedUser = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken, googleUser.accessToken,
        );
        credential = await firebase.auth(userApp).signInWithCredential(authenticatedUser)
          .catch((error) => {
            if (error.code === 'auth/account-exists-with-different-credential') {
              throw new Error('Email associated with another account.');
            } else {
              throw new Error('Something went wrong!');
            }
          });
        // console.log(credential)
      } else {
        throw new Error('Google sign in cancelled!');
      }
    } else {
      credential = await firebase.auth(userApp).createUserWithEmailAndPassword(email, password)
        .catch(async (error) => {
          if (error.code === 'auth/email-already-in-use') {
            throw new Error('Email associated with another account.'); // accountExists = true
          }
          if (error.code === 'auth/invalid-email') {
            throw new Error('That email address is invalid!');
          }
        });
    }
    if (accountExists) {
      credential = await firebase.auth(userApp).signInWithEmailAndPassword(email, password)
        .catch((error) => {
          if (error.code === 'auth/wrong-password') {
            throw new Error('Email associated with another account.');
          } else {
            throw new Error('Something went wrong!');
          }
        });
    }
    const userID = credential.user.uid;

    let userData = (await firebase.database(userApp).ref(`/users/${userID}`).once('value')).val();
    if (userData === null) {
      // handle case: new user account creation
      userData = { id: userID };
      if (useGoogle) {
        userData.email = googleUser.user.email;
      } else {
        userData.email = email;
      }
      await firebase.database(userApp).ref(`/users/${userID}`).set({ email: userData.email });
      dispatch({
        type: CREATE_USER,
        userData: {
          id: userID,
          email,
        },
      });
      return true;
    } if (accountExists) {
      // handle case: user account already exists
      throw new Error('Email associated with another account.');
    } else {
      // handle case: google sign in
      const user = new Customer(userID, email);
      user.RS = userData.RS;
      user.favorites = userData.favorites;
      dispatch({
        type: GET_USER,
        user,
      });
      return false;
    }
  };
};

export const getUser = (email, password, authenticated) => {
  console.log('~User Action: getUser');
  return async (dispatch) => {
    let userID;
    if (authenticated) {
      userID = firebase.auth(userApp).currentUser.uid;
    } else {
      let credential = null;
      credential = await firebase.auth(userApp).signInWithEmailAndPassword(email, password)
        .catch((error) => {
          if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            throw new Error('Wrong password. Try again.');
          } else {
            throw new Error('Something went wrong!');
          }
        });
      userID = credential.user.uid;
    }
    const userData = (await firebase.database(userApp).ref(`/users/${userID}`).once('value')).val();
    if (userData === null) {
      throw new Error('Wrong password. Try again.');
    }
    const user = new Customer(userID, userData.email);
    user.RS = userData.RS;
    user.favorites = userData.favorites;
    // console.log(userData)
    // console.log(user);
    dispatch({
      type: GET_USER,
      user,
    });
  };
};

export const logoutUser = () => {
  console.log('~User Action: logoutUser');
  return async (dispatch) => {
    await firebase.auth(userApp).signOut();
    dispatch({ type: LOGOUT_USER });
  };
};

export const refreshUser = (userID) => {
  console.log('~User Action: refreshUser');
  return async (dispatch) => {
    // any async code you want!
    const userData = (await firebase.database(userApp).ref(`/users/${userID}`).once('value')).val();
    const user = new Customer(userID, userData.email);
    user.RS = userData.RS;
    user.favorites = userData.favorites;
    dispatch({
      type: GET_USER,
      user,
    });
  };
};

export const toggleFav = (merchantID, userID, merchantSide) => {
  console.log('~User Action: toggleFav');
  return async (dispatch) => {
    let userData = null;
    if (merchantSide) {
      userData = (await firebase.database(merchantApp).ref(`/users/${userID}`).once('value')).val();
    } else {
      userData = (await firebase.database(userApp).ref(`/users/${userID}`).once('value')).val();
    }
    let favorites = [];
    // console.log('userData.favorites')
    // console.log(userData.favorites);
    if (userData.favorites === undefined) {
      // console.log('if')
      favorites.push(merchantID);
    } else if (!merchantSide) {
      // console.log('else')
      favorites = userData.favorites;
      // console.log(favorites);
      const existingIndex = favorites.findIndex((m) => m === merchantID);
      if (existingIndex >= 0) {
        favorites.splice(existingIndex, 1);
      } else {
        favorites.push(merchantID);
      }
    } else {
      return;
    }
    // console.log(favorites);
    if (merchantSide) {
      await firebase.database(merchantApp).ref(`/users/${userID}/favorites`).set(favorites);
    } else {
      await firebase.database(userApp).ref(`/users/${userID}/favorites`).set(favorites);
    }
    const user = new Customer(userID, userData.email);
    user.RS = userData.RS;
    user.favorites = favorites;
    dispatch({
      type: GET_USER,
      user,
    });
  };
};

export const updateRewards = (merchantID, userID, amount) => {
  console.log('~User Action: updateRewards');
  // update the value of user rewards status... TODO
  // console.log(userID)
  return async (dispatch) => {
    const userData = (await firebase.database(merchantApp).ref(`/users/${userID}`).once('value')).val();
    if (userData === null) {
      throw new Error('User does not exist!');
    }
    const rs = userData.RS;

    // console.log('-----Updating RS-----');
    // console.log(rs);

    let isPresent = false;
    let insufficient = false;
    const RS = [];
    if (!(RS === undefined)) {
      Object.values(rs).forEach((value) => {
        if (value.merchantID === merchantID) {
          // this handles if the user doesn't have enough rewards, when redeeming
          if ((value.amount + amount) < 0) {
            insufficient = true;
            RS.push(
              new RewardStatus(
                value.merchantID, value.amount,
              ),
            );
          } else {
            RS.push(
              new RewardStatus(
                value.merchantID, (value.amount + amount),
              ),
            );
            isPresent = true;
          }
        } else {
          RS.push(
            new RewardStatus(
              value.merchantID, value.amount,
            ),
          );
        }
      });
      if (!isPresent) {
        if (amount < 0) {
          insufficient = true;
        } else {
          RS.push(new RewardStatus(merchantID, amount));
        }
      }
    } else if (amount < 0) {
      insufficient = true;
    } else {
      RS.push(new RewardStatus(merchantID, amount));
    }
    // console.log(RS);
    // const d = new Deal(amount, reward, '|.||..|.||..|');

    await firebase.database(merchantApp).ref(`/users/${userID}/RS`).set(RS);

    dispatch({
      type: UPDATE_RS,
      merchant: merchantID,
      user: userID,
      RS,
    });
    if (insufficient) {
      throw new Error('insufficient');
    } else {
      throw new Error('none');
    }
  };
};
