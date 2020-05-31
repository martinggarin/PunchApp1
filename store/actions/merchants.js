export const CREATE_MERCHANT = 'ADD_MERCHANT';
export const GET_MERCHANT = 'GET_MERCHANT';
export const LOGOUT_MERCHANT = 'LOGOUT_MERCHANT'
export const UPDATE_MERCHANT = 'UPDATE_MERCHANT';
export const UPDATE_DEALS = 'UPDATE_DEALS';
export const LOAD_ALL_MERCHANTS = 'LOAD_ALL_MERCHANTS';

import Merchant from '../../models/Merchant';
import Deal from '../../models/Deal';

import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import Apps from '../../firebaseApp';

const userApp = Apps.firebaseApp.user
const merchantApp = Apps.firebaseApp.merchant

export const createMerchant = (email, password, useGoogle) => {
  console.log('~Merchant Action: createMerchant')
  return async dispatch => {
    // any async code you want!
    let credential = null
    let googleUser = null
    let accountExists = false
    if (useGoogle){
      googleUser = await Google.logInAsync({
        androidClientId:'685510681673-falsomf7g38i1d2v957dksi672oa75pa.apps.googleusercontent.com',
        iosClientId:'685510681673-223e0ep20l00k03mf5fes84ojhdkjhr1.apps.googleusercontent.com'
      });
      if (googleUser.type === 'success'){
        var authenticatedMerchant = firebase.auth.GoogleAuthProvider.credential(googleUser.idToken, googleUser.accessToken)
        credential = await firebase.auth(merchantApp).signInWithCredential(authenticatedMerchant)
        .catch(error => {
          if (error.code === 'auth/account-exists-with-different-credential') {
            throw new Error('Email associated with another account.');
          }else {
            throw new Error('Something went wrong!')
          }
        })
      }else{
        throw new Error('Google sign in cancelled!');
      }
    }else{
      credential = await firebase.auth(merchantApp).createUserWithEmailAndPassword(email, password)
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
           accountExists = true
        }
        if (error.code === 'auth/invalid-email') {
          throw new Error('That email address is invalid!');
        }
      });
    }
    if (accountExists){
      credential = await firebase.auth(merchantApp).signInWithEmailAndPassword(email, password)
      .catch(error => {
        if (error.code === 'auth/wrong-password') {
          throw new Error('Email associated with another account.');
        }else{
          throw new Error('Something went wrong!')
        }
      });
    }
    const m_id = credential.user.uid

    let merchantData = (await firebase.database(merchantApp).ref(`/merchants/${m_id}`).once('value')).val()
    if (merchantData === null){
      //handle case: new merchant account creation
      let merchantData = {id: m_id}
      if (useGoogle){
        merchantData.email = googleUser.user.email
      }else{
        merchantData.email = email
      }
      await firebase.database(merchantApp).ref(`/merchants/${m_id}`).set({email:merchantData.email})
      dispatch({
        type: CREATE_MERCHANT,
        merchantData: merchantData
      });
      return true
    }else if (accountExists){
      //handle case: merchant account already exists
      throw new Error('Email associated with another account.');
    }else{
      //handle case: google sign in
      const merchant = new Merchant(m_id, googleUser.user.email);
      merchant.title = merchantData.title
      merchant.price = merchantData.price
      merchant.type = merchantData.type
      merchant.address = merchantData.address
      merchant.city = merchantData.city
      merchant.deal = merchantData.deal
      merchant.customers = merchantData.customers
      dispatch({
        type: GET_MERCHANT,
        merchant: merchant
      })
      return false
    }
  };
};

export const getMerchant = (email, password) => {
  console.log('~Merchant Action: getMerchant')
  return async dispatch => {
    
    credential = await firebase.auth(merchantApp).signInWithEmailAndPassword(email, password)
    .catch(error => {
      if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Wrong password. Try again.');
      }else{
        throw new Error('Something went wrong!')
      }
    });
    const m_id = credential.user.uid
    let merchantData = (await firebase.database(merchantApp).ref(`/merchants/${m_id}`).once('value')).val()
    if (merchantData === null){
      throw new Error('Wrong password. Try again.');
    }
    const merchant = new Merchant(m_id, email);
    merchant.title = merchantData.title
    merchant.price = merchantData.price
    merchant.type = merchantData.type
    merchant.address = merchantData.address
    merchant.city = merchantData.city
    merchant.deal = merchantData.deal
    merchant.customers = merchantData.customers
    //console.log('Fetching Deal')
    //console.log(merchantData[key].deal);
    //console.log(merchant.deal);

    dispatch({ 
      type: GET_MERCHANT,
      merchant: merchant,
    });
  };
};

export const logoutMerchant = () => {
  console.log('~Merchant Action: logoutMerchant')
  return async dispatch => {
    await firebase.auth(merchantApp).signOut()
    await dispatch({ type: LOGOUT_MERCHANT})
  }
};

export const updateMerchant = (id, title, price, type, address, city) => {
  console.log('~Merchant Action: updateMerchant')
  return async dispatch =>{
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${id}`).once('value')).val()
    
    if (merchantData.deal === undefined){
      merchantData.deal = null
    }
    if (merchantData.customers === undefined){
      merchantData.customers = null
    }
    const updatedMerchantData = {
      email:merchantData.email,
      deal:merchantData.deal,
      customers:merchantData.customers
    }
    updatedMerchantData.title = title
    updatedMerchantData.price = price
    updatedMerchantData.type = type
    updatedMerchantData.address = address
    updatedMerchantData.city = city
    await firebase.database(merchantApp).ref(`/merchants/${id}`).set(updatedMerchantData)
    updatedMerchantData.id = id

    dispatch({
      type: UPDATE_MERCHANT,
      merchantData: updatedMerchantData 
    })
  }
};

export const updateCustomers = (id, customerID) => {
  console.log('~Merchant Action: updateCustomers')
  return async dispatch =>{
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${id}`).once('value')).val()
    merchantData.id = id
    if (merchantData.customers === undefined){
      var customers = [customerID]
    }
    else{
      var customers = merchantData.customers
    }
    var isExistingCustomer = false
    for (const key in customers){
      if (customers[key] === customerID){
        isExistingCustomer = true
        break
      }
    }
    if (!isExistingCustomer){
      customers.push(customerID)
    }
    merchantData.customers = customers

    await firebase.database(merchantApp).ref(`/merchants/${id}/customers`).set(customers)

    dispatch({
      type:UPDATE_MERCHANT,
      merchantData:merchantData
    })
  }
};

export const updateDeal = (id, ammount, reward, code) => {
  console.log('~Merchant Action: updateDeal')
  return async (dispatch, getState) =>{
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${id}`).once('value')).val()
    //console.log(id)
    if (merchantData.deal === undefined){
      var deal = []
    }else{
      var deal = merchantData.deal
    }
    //console.log('-----deals-----');
    //console.log(deal);
    
    var newDeal = new Deal(ammount, reward, code)
    if (deal.length === code){
      deal.push(newDeal)
    }
    else{
      deal[code] = newDeal
    }

    await firebase.database(merchantApp).ref(`/merchants/${id}/deal`).set(deal)

    dispatch({
      type: UPDATE_DEALS,
      deal: deal
    })
  }
};

export const removeDeal = (id, code) => {
  console.log('~Merchant Action: removeDeal')
  return async dispatch =>{
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${id}`).once('value')).val()
    const deals = merchantData.deal; 

    //console.log('-----deals-----');
    //console.log(deals);
    
    if(!(deals === undefined)){
      deal = []
      var count = 0
      for (const key in deals){
        if (!(deals[key].code === code)){
          deal.push(
            new Deal(deals[key].ammount, deals[key].reward, count)
          )
          count += 1
        }
      }
    }
    //console.log(deal);

    await firebase.database(merchantApp).ref(`/merchants/${id}/deal`).set(deal)

    dispatch({
      type: UPDATE_DEALS,
      deal: deal
    })
  }
};

export const loadAllMerchants = () => {
    console.log('~Merchant Action: loadAllMerchants')
    return async dispatch => {
        // any async code you want!
        const merchantData = (await firebase.database(userApp).ref(`/merchants`).once('value')).val()
        //console.log(merchantData)
        const loadedMerchants = [];
        for (const key in merchantData) {
          
          const merchant = new Merchant(
              key,
              merchantData[key].email,
          );
          merchant.title = merchantData[key].title
          merchant.price = merchantData[key].price
          merchant.type = merchantData[key].type
          merchant.address = merchantData[key].address
          merchant.city = merchantData[key].city
          merchant.deal = merchantData[key].deal
          merchant.customers = merchantData[key].customers
          console.log(merchant.deal)
          loadedMerchants.push(merchant)
        }
        //console.log(loadedMerchants);
        var filteredMerchants = loadedMerchants.filter(function(m){
          return !(m.deal === undefined)
        })
        //console.log(filteredMerchants);
        dispatch({ type: LOAD_ALL_MERCHANTS, merchants: filteredMerchants });
      };
};