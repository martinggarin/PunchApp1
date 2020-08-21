export const CREATE_MERCHANT = 'ADD_MERCHANT';
export const GET_MERCHANT = 'GET_MERCHANT';
export const LOGOUT_MERCHANT = 'LOGOUT_MERCHANT'
export const UPDATE_MERCHANT = 'UPDATE_MERCHANT';
export const UPDATE_DEALS = 'UPDATE_DEALS';
export const UPDATE_EMPLOYEES = 'UPDATE_EMPLOYEES';
export const LOAD_ALL_MERCHANTS = 'LOAD_ALL_MERCHANTS';

import Merchant from '../../models/Merchant';
import Deal from '../../models/Deal';
import Employee from '../../models/Employee';

import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import Apps from '../../firebaseApp';
import moment from 'moment'

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
          throw new Error('Email associated with another account.'); //accountExists = true
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
      merchant.transactions = merchantData.transactions
      merchant.adminPassword = merchantData.adminPassword
      merchant.employees = merchantData.employees
      dispatch({
        type: GET_MERCHANT,
        merchant: merchant
      })
      return false
    }
  };
};

export const getMerchant = (email, password, authenticated) => {
  console.log('~Merchant Action: getMerchant')
  return async dispatch => {
    if (authenticated){
      var m_id = firebase.auth(merchantApp).currentUser.uid
    }else{
      credential = await firebase.auth(merchantApp).signInWithEmailAndPassword(email, password)
      .catch(error => {
        if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          throw new Error('Wrong password. Try again.');
        }else{
          throw new Error('Something went wrong!')
        }
      });
      var m_id = credential.user.uid
    }
    let merchantData = (await firebase.database(merchantApp).ref(`/merchants/${m_id}`).once('value')).val()
    if (merchantData === null){
      throw new Error('Wrong password. Try again.');
    }
    let merchant = new Merchant(m_id, email);
    merchant.title = merchantData.title
    merchant.price = merchantData.price
    merchant.type = merchantData.type
    merchant.address = merchantData.address
    merchant.city = merchantData.city
    merchant.deal = merchantData.deal
    merchant.customers = merchantData.customers
    merchant.transactions = merchantData.transactions
    merchant.adminPassword = merchantData.adminPassword
    merchant.employees = merchantData.employees
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

export const updateMerchant = (m_id, title, price, type, address, city, adminPassword) => {
  console.log('~Merchant Action: updateMerchant')
  return async dispatch =>{
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${m_id}`).once('value')).val()
    
    if (merchantData.deal === undefined){
      merchantData.deal = null
    }
    if (merchantData.customers === undefined){
      merchantData.customers = null
    }
    const updatedMerchantData = {
      email:merchantData.email,
      deal:merchantData.deal,
      customers:merchantData.customers,
      transactions:merchantData.transactions,
      employees:merchantData.employees
    }
    updatedMerchantData.title = title
    updatedMerchantData.price = price
    updatedMerchantData.type = type
    updatedMerchantData.address = address
    updatedMerchantData.city = city
    updatedMerchantData.adminPassword = adminPassword
    await firebase.database(merchantApp).ref(`/merchants/${m_id}`).set(updatedMerchantData)
    updatedMerchantData.id = m_id

    dispatch({
      type: UPDATE_MERCHANT,
      merchantData: updatedMerchantData 
    })
  }
};

export const updateCustomers = (m_id, customerID) => {
  console.log('~Merchant Action: updateCustomers')
  return async dispatch =>{
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${m_id}`).once('value')).val()
    merchantData.id = m_id
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

    await firebase.database(merchantApp).ref(`/merchants/${m_id}/customers`).set(customers)

    dispatch({
      type:UPDATE_MERCHANT,
      merchantData:merchantData
    })
  }
};

export const addTransaction = (m_id, employee, customerID, amount, reward) => {
  console.log('~Merchant Action: addTransactions')
  return async dispatch =>{
    var date = moment()
      .utcOffset('-04:00')
      .format('MM/DD/YY hh:mm:ss a');
    const newTransaction = (reward) ? {
      date:date, 
      customerID:customerID, 
      employee:employee.name, 
      location:employee.location, 
      reward:reward, 
      amount:amount
    }:{
      date:date, 
      customerID:customerID,
      employee:employee.name, 
      location:employee.location, 
      amount:amount
    }
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${m_id}`).once('value')).val()
    var transactions = merchantData.transactions
    merchantData.id = m_id
    
    if (transactions === undefined){
      transactions = [newTransaction]
    }
    else{
      transactions.push(newTransaction)
    }
    merchantData.transactions = transactions

    await firebase.database(merchantApp).ref(`/merchants/${m_id}/transactions`).set(transactions)

    dispatch({
      type:UPDATE_MERCHANT,
      merchantData:merchantData
    })
  }
};

export const updateDeal = (m_id, amount, reward, code) => {
  console.log('~Merchant Action: updateDeal')
  return async dispatch =>{
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${m_id}`).once('value')).val()
    //console.log(id)
    if (merchantData.deal === undefined){
      var deals = []
    }else{
      var deals = merchantData.deal
    }

    var newDeal = new Deal(amount, reward, code)
    if (deals.length === code){
      deals.push(newDeal)
    }
    else{
      deals[code] = newDeal
    }
    var updatedDeals = []
    var count = 0
    deals.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    for (const key in deals){
      updatedDeals.push(
        new Deal(deals[key].amount, deals[key].reward, count)
      )
      count += 1
    }
    //console.log('-----deals-----');
    //console.log(deal);

    await firebase.database(merchantApp).ref(`/merchants/${m_id}/deal`).set(updatedDeals)

    dispatch({
      type: UPDATE_DEALS,
      deal: updatedDeals
    })
  }
};

export const removeDeal = (m_id, code) => {
  console.log('~Merchant Action: removeDeal')
  return async dispatch =>{
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${m_id}`).once('value')).val()
    const deals = merchantData.deal; 

    //console.log('-----deals-----');
    //console.log(deals);
    
    if(!(deals === undefined)){
      var deal = []
      var count = 0
      deals.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
      for (const key in deals){
        if (!(deals[key].code === code)){
          deal.push(
            new Deal(deals[key].amount, deals[key].reward, count)
          )
          count += 1
        }
      }
    }else{
      var deal = []
    }
    //console.log(deal);

    await firebase.database(merchantApp).ref(`/merchants/${m_id}/deal`).set(deal)

    dispatch({
      type: UPDATE_DEALS,
      deal: deal
    })
  }
};

export const updateEmployee = (m_id, name, location, type, id, code) => {
  console.log('~Merchant Action: updateEmployee')
  return async dispatch =>{
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${m_id}`).once('value')).val()
    if (merchantData.employees === undefined){
      var employees = []
    }else{
      var employees = merchantData.employees
    }
    
    var newEmployee = new Employee(name, location, type, id, code)
    if (employees.length === code){
      employees.push(newEmployee)
    }else{
      employees[code] = newEmployee
    }
    var updatedEmployees = []
    var count = 0
    employees.sort((a, b) => a.name.localeCompare(b.name));
    for (const key in employees){
      updatedEmployees.push(
        new Employee(employees[key].name, employees[key].location, employees[key].type, employees[key].id, count)
      )
      count += 1
    }
    await firebase.database(merchantApp).ref(`/merchants/${m_id}/employees`).set(updatedEmployees)

    dispatch({
      type: UPDATE_EMPLOYEES,
      employees: updatedEmployees
    })
  }
};

export const removeEmployee = (m_id, code) => {
  console.log('~Merchant Action: removeEmployee')
  return async dispatch =>{
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${m_id}`).once('value')).val()
    const employees = merchantData.employees; 
    
    if(!(employees === undefined)){
      var updatedEmployees = []
      var count = 0
      employees.sort((a, b) => a.name.localeCompare(b.name));
      for (const key in employees){
        if (!(employees[key].code === code)){
          updatedEmployees.push(
            new Employee(employees[key].name, employees[key].location, employees[key].type, employees[key].id, count)
          )
          count += 1
        }
      }
    }else{
      var updatedEmployees = []
    }

    await firebase.database(merchantApp).ref(`/merchants/${m_id}/employees`).set(updatedEmployees)

    dispatch({
      type: UPDATE_EMPLOYEES,
      employees: updatedEmployees
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
          //console.log(merchant.deal)
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