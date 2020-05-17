export const CREATE_USER = 'CREATE_USER';
export const GET_USER = 'GET_USER';
export const LOGOUT_USER = 'LOGOUT_USER'
export const REFRESH_USER = 'REFRESH_USER';
export const TOGGLE_FAV = 'TOGGLE_FAV';
export const UPDATE_RS = 'UPDATE_RS';

import Customer from '../../models/Customer';
import RewardStatus from '../../models/RewardsStatus';

import * as Google from 'expo-google-app-auth';
import firebase from 'firebase'
import { userConfig } from '../../config'

import merchantApp from './merchants'
firebase.initializeApp(userConfig, 'user')
const userApp = firebase.app('user')


export const createUser = (email, password) => {
  console.log('~User Action: createUser')
  return async dispatch => {
    // any async code you want!
    let credential = await firebase.auth(userApp).createUserWithEmailAndPassword(email, password)
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('That email address is already in use!');
      }
  
      if (error.code === 'auth/invalid-email') {
        throw new Error('That email address is invalid!');
      }
    });
    
    const u_id = credential.user.uid
    await firebase.database(userApp).ref(`/users/${u_id}`).set({email:email})
    //console.log(resData);

    dispatch({
      type: CREATE_USER,
      userData: {
        id: u_id,
        email: email,
      }
    });
  };
};

export const getUser = (email, password, useGoogle) => {
  console.log('~User Action: getUser')
  return async dispatch => {
    // any async code you want!
    let credential = null
    let googleUser = null
    if (useGoogle){
      googleUser = await Google.logInAsync({
        androidClientId:'685510681673-falsomf7g38i1d2v957dksi672oa75pa.apps.googleusercontent.com',
      });
      if (googleUser.type === 'success'){
        var authenticatedUser = firebase.auth.GoogleAuthProvider.credential(googleUser.idToken, googleUser.accessToken)
        credential = await firebase.auth(userApp).signInWithCredential(authenticatedUser)
        .catch(error => {
          if (errorCode === 'auth/account-exists-with-different-credential') {
            throw new Error('Email already associated with another account.');
          } else {
            throw new Error('Something went wrong!')
          }
        })
        console.log(credential)
      }else{
        throw new Error('Something went wrong 1!');
      }
    }else{
      credential = await firebase.auth(userApp).signInWithEmailAndPassword(email, password)
      .catch(error => {
        if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          throw new Error('Wrong password. Try again.');
        }else{
          throw new Error('Something went wrong!')
        }
      });
    }
    const u_id = credential.user.uid
    let resData = (await firebase.database(userApp).ref(`/users/${u_id}`).once('value')).val()
    if (resData === null){
      resData = {
        email:googleUser.user.email,
      }
      await firebase.database(userApp).ref(`users/${u_id}`).set(resData)
    }
    const user = new Customer(u_id, email);
    user.RS = resData.RS;
    user.favorites = resData.favorites;
    //console.log(resData)
    //console.log(user);
    
    dispatch({
      type: GET_USER,
      user: user
    });
  };
};

export const logoutUser = () => {
  console.log('~User Action: logoutUser')
  return async dispatch => {
    await firebase.auth(userApp).signOut()
    dispatch({ type: LOGOUT_USER})
  }
}

export const refreshUser = (id) => {
  console.log('~User Action: refreshUser')
  return async (dispatch, getState) => {
    // any async code you want!
    try {
      const resData = (await firebase.database(userApp).ref(`/users/${id}`).once('value')).val()
      const user = new Customer(id, resData.email);
      user.RS = resData.RS;
      user.favorites = resData.favorites;
      
      dispatch({ type: REFRESH_USER, user: user });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
}

export const toggleFav = (r_id, u_id, merchantSide) => {
  console.log('~User Action: toggleFav')
  return async (dispatch, getState) => {
    if (merchantSide) {
      resData = (await firebase.database(merchantApp).ref(`/users/${u_id}`).once('value')).val
    }else{
      resData = (await firebase.database(userApp).ref(`/users/${u_id}`).once('value')).val
    }
    let favorites = [];
    //console.log('resData.favorites')
    //console.log(resData.favorites);
    if(resData.favorites === undefined)
    {
      //console.log('if')
      favorites.push(r_id);
    }
    else{
      //console.log('else')
      favorites = resData.favorites;
      //console.log(favorites);
      const existingIndex = favorites.findIndex(m => m === r_id);
        if(existingIndex >= 0 ){
          favorites.splice(existingIndex, 1);
        }else{
          favorites.push(r_id);
        }
    }
    //console.log(favorites);
    if (merchantSide) {
      await firebase.database(merchantApp).ref(`/users/${u_id}/favorites`).set(favorites)
    }else{
      await firebase.database(userApp).ref(`/users/${u_id}/favorites`).set(favorites)
    }

    dispatch({
      type: TOGGLE_FAV,
      favorites: favorites
    });
  };
};

export const updateRewards = (r_id, u_id, ammount) => {
  console.log('~User Action: updateRewards')
  //update the value of user rewards status... TODO
  //console.log(u_id)
  return async (dispatch, getState) =>{
    resData1 = (await firebase.database(userApp).ref(`/users/${u_id}`).once('value')).val
    //console.log(resData1)
    if(resData1 === null){
      throw new Error('User does not exist!')
    }
    const rs = resData1.RS; 

    //console.log('-----Updating RS-----');
    //console.log(rs);

    let isPresent = false;
    const RS = [];
    if(!(RS === undefined)){
      for(const key in rs){
        //if the item already exists
        if(rs[key].r_id === r_id){
          //this handles if the user doesn't have enough rewards, when redeeming
          if((rs[key].ammount+ammount) < 0){
            throw 'insufficient';
          }
          RS.push(
            new RewardStatus(
              rs[key].r_id, (rs[key].ammount+ammount)
            )
          );
          isPresent = true;
        }else{
          RS.push(
            new RewardStatus(
              rs[key].r_id, rs[key].ammount
            )
          );
        }
      
      }//for
      if(!isPresent){
        if(ammount < 0){
          throw 'insufficient';
        }
        RS.push(new RewardStatus(r_id, ammount));
      }
    }//if
    else{
      if(ammount < 0){
        throw 'insufficient';
      }
      RS.push(new RewardStatus(r_id, ammount));
    }
    //console.log(RS);
    //const d = new Deal(ammount, reward, '|.||..|.||..|');

    await firebase.database(userApp).ref(`/users/${u_id}/RS`).set(RS)

    dispatch({
      type: UPDATE_RS,
      merchant:r_id,
      user:u_id, 
      RS: RS
    })
    throw 'none'
  }

}