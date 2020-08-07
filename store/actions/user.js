export const CREATE_USER = 'CREATE_USER';
export const GET_USER = 'GET_USER';
export const LOGOUT_USER = 'LOGOUT_USER'
export const UPDATE_RS = 'UPDATE_RS';

import Customer from '../../models/Customer';
import RewardStatus from '../../models/RewardsStatus';

import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import Apps from '../../firebaseApp';

const userApp = Apps.firebaseApp.user
const merchantApp = Apps.firebaseApp.merchant

export const createUser = (email, password, useGoogle) => {
  console.log('~User Action: createUser')
  return async dispatch => {
    let credential = null
    let googleUser = null
    let accountExists = false

    if (useGoogle){
      googleUser = await Google.logInAsync({
        androidClientId:'685510681673-falsomf7g38i1d2v957dksi672oa75pa.apps.googleusercontent.com',
        iosClientId:'685510681673-223e0ep20l00k03mf5fes84ojhdkjhr1.apps.googleusercontent.com'
      });
      if (googleUser.type === 'success'){
        var authenticatedUser = firebase.auth.GoogleAuthProvider.credential(googleUser.idToken, googleUser.accessToken)
        credential = await firebase.auth(userApp).signInWithCredential(authenticatedUser)
        .catch(error => {
          if (error.code === 'auth/account-exists-with-different-credential') {
            throw new Error('Email associated with another account.');
          } else {
            throw new Error('Something went wrong!')
          }
        })
        //console.log(credential)
      }else{
        throw new Error('Google sign in cancelled!');
      }
    }else{
      credential = await firebase.auth(userApp).createUserWithEmailAndPassword(email, password)
      .catch(async (error) => {
        if (error.code === 'auth/email-already-in-use') {
          accountExists = true
        }
        if (error.code === 'auth/invalid-email') {
          throw new Error('That email address is invalid!');
        }
      });
    }
    if (accountExists){
      credential = await firebase.auth(userApp).signInWithEmailAndPassword(email, password)
      .catch(error => {
        if (error.code === 'auth/wrong-password') {
          throw new Error('Email associated with another account.');
        }else{
          throw new Error('Something went wrong!')
        }
      });
    }
    const u_id = credential.user.uid

    let userData = (await firebase.database(userApp).ref(`/users/${u_id}`).once('value')).val()
    if (userData === null){
      //handle case: new user account creation
      let userData = {id: u_id}
      if (useGoogle){
        userData.email = googleUser.user.email
      }else{
        userData.email = email
      }
      await firebase.database(userApp).ref(`/users/${u_id}`).set({email:userData.email})
      dispatch({
        type: CREATE_USER,
        userData: {
          id: u_id,
          email: email,
        }
      });
      return true
    }else if (accountExists){
      //handle case: user account already exists
      throw new Error('Email associated with another account.');
    }else{
      //handle case: google sign in
      const user = new Customer(u_id, email);
      user.RS = userData.RS;
      user.favorites = userData.favorites;
      dispatch({
        type: GET_USER,
        user: user
      });
      return false
    }
  };
};

export const getUser = (email, password) => {
  console.log('~User Action: getUser')
  return async dispatch => {
    // any async code you want!
    let credential = null
    credential = await firebase.auth(userApp).signInWithEmailAndPassword(email, password)
    .catch(error => {
      if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Wrong password. Try again.');
      }else{
        throw new Error('Something went wrong!')
      }
    });
    const u_id = credential.user.uid
    const userData = (await firebase.database(userApp).ref(`/users/${u_id}`).once('value')).val()
    if (userData === null){
      throw new Error('Wrong password. Try again.');
    }
    let user = new Customer(u_id, email);
    user.RS = userData.RS;
    user.favorites = userData.favorites;
    //console.log(userData)
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

export const refreshUser = (u_id) => {
  console.log('~User Action: refreshUser')
  return async dispatch => {
    // any async code you want!
    const userData = (await firebase.database(userApp).ref(`/users/${u_id}`).once('value')).val()
    let user = new Customer(u_id, userData.email);
    user.RS = userData.RS;
    user.favorites = userData.favorites;
    dispatch({ 
      type: GET_USER,
      user: user 
    });
  };
}

export const toggleFav = (r_id, u_id, merchantSide) => {
  console.log('~User Action: toggleFav')
  return async dispatch => {
    let userData = null
    if (merchantSide) {
      userData = (await firebase.database(merchantApp).ref(`/users/${u_id}`).once('value')).val()
    }else{
      userData = (await firebase.database(userApp).ref(`/users/${u_id}`).once('value')).val()
    }
    let favorites = [];
    //console.log('userData.favorites')
    //console.log(userData.favorites);
    if(userData.favorites === undefined){
      //console.log('if')
      favorites.push(r_id);
    }else if(!merchantSide){
      //console.log('else')
      favorites = userData.favorites;
      //console.log(favorites);
      const existingIndex = favorites.findIndex(m => m === r_id);
      if(existingIndex >= 0){
        favorites.splice(existingIndex, 1);
      }else{
        favorites.push(r_id);
      }
    }else{
      return
    }
    //console.log(favorites);
    if (merchantSide) {
      await firebase.database(merchantApp).ref(`/users/${u_id}/favorites`).set(favorites)
    }else{
      await firebase.database(userApp).ref(`/users/${u_id}/favorites`).set(favorites)
    }
    const user = new Customer(u_id, userData.email);
    user.RS = userData.RS;
    user.favorites = favorites;
    dispatch({
      type: GET_USER,
      user: user
    });
  };
};

export const updateRewards = (r_id, u_id, amount) => {
  console.log('~User Action: updateRewards')
  //update the value of user rewards status... TODO
  //console.log(u_id)
  return async dispatch =>{
    const userData = (await firebase.database(merchantApp).ref(`/users/${u_id}`).once('value')).val()
    if(userData === null){
      throw new Error('User does not exist!')
    }
    const rs = userData.RS; 

    //console.log('-----Updating RS-----');
    //console.log(rs);

    let isPresent = false;
    const RS = [];
    if(!(RS === undefined)){
      for(const key in rs){
        //if the item already exists
        if(rs[key].r_id === r_id){
          //this handles if the user doesn't have enough rewards, when redeeming
          if((rs[key].amount+amount) < 0){
            throw 'insufficient';
          }
          RS.push(
            new RewardStatus(
              rs[key].r_id, (rs[key].amount+amount)
            )
          );
          isPresent = true;
        }else{
          RS.push(
            new RewardStatus(
              rs[key].r_id, rs[key].amount
            )
          );
        }
      
      }//for
      if(!isPresent){
        if(amount < 0){
          throw 'insufficient';
        }
        RS.push(new RewardStatus(r_id, amount));
      }
    }//if
    else{
      if(amount < 0){
        throw 'insufficient';
      }
      RS.push(new RewardStatus(r_id, amount));
    }
    //console.log(RS);
    //const d = new Deal(amount, reward, '|.||..|.||..|');

    await firebase.database(merchantApp).ref(`/users/${u_id}/RS`).set(RS)

    dispatch({
      type: UPDATE_RS,
      merchant:r_id,
      user:u_id, 
      RS: RS
    })
    throw 'none'
  }

}