// import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import moment from 'moment';
import Merchant from '../../models/Merchant';
import Deal from '../../models/Deal';
import Employee from '../../models/Employee';

import Apps from '../../firebaseApp';

export const CREATE_MERCHANT = 'ADD_MERCHANT';
export const GET_MERCHANT = 'GET_MERCHANT';
export const LOGOUT_MERCHANT = 'LOGOUT_MERCHANT';
export const UPDATE_MERCHANT = 'UPDATE_MERCHANT';
export const UPDATE_DEALS = 'UPDATE_DEALS';
export const UPDATE_EMPLOYEES = 'UPDATE_EMPLOYEES';
export const LOAD_ALL_MERCHANTS = 'LOAD_ALL_MERCHANTS';

const userApp = Apps.firebaseApp.user;
const merchantApp = Apps.firebaseApp.merchant;

export const createMerchant = (email, password, inputToken) => {
  console.log('~Merchant Action: createMerchant');
  return async (dispatch) => {
    // any async code you want!
    let credential = null;
    let accountExists = false;
    // if (useGoogle) {
    //  googleUser = await Google.logInAsync({
    //    androidClientId:
    //       '685510681673-falsomf7g38i1d2v957dksi672oa75pa.apps.googleusercontent.com',
    //    iosClientId: '685510681673-223e0ep20l00k03mf5fes84ojhdkjhr1.apps.googleusercontent.com',
    //  });
    //  if (googleUser.type === 'success') {
    //    const authenticatedMerchant = firebase.auth.GoogleAuthProvider.credential(
    //      googleUser.idToken, googleUser.accessToken,
    //    );
    //    credential = await firebase.auth(merchantApp).signInWithCredential(authenticatedMerchant)
    //      .catch((error) => {
    //        if (error.code === 'auth/account-exists-with-different-credential') {
    //          throw new Error('Email associated with another account.');
    //        } else {
    //          throw new Error('Something went wrong!');
    //        }
    //      });
    //  } else {
    //    throw new Error('Google sign in cancelled!');
    //  }
    // }
    credential = await firebase.auth(merchantApp).createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          accountExists = true;
        }
        if (error.code === 'auth/invalid-email') {
          throw new Error('That email address is invalid!');
        }
      });
    if (accountExists) {
      credential = await firebase.auth(merchantApp).signInWithEmailAndPassword(email, password)
        .catch((error) => {
          if (error.code === 'auth/wrong-password') {
            throw new Error('Email associated with another account.');
          } else {
            throw new Error('Something went wrong!');
          }
        });
    }
    const merchantID = credential.user.uid;
    const tokens = (await firebase.database(merchantApp).ref('/tokens').once('value')).val();
    let token;
    let tokenIndex;
    Object.values(tokens).forEach((value, index) => {
      if (value.token === inputToken) {
        token = value;
        tokenIndex = index;
      }
    });
    if (token === undefined) {
      throw new Error('Unknown merchant creation token.');
    } else if (token.merchantID !== undefined) {
      throw new Error('Merchant creation token associated with another account.');
    }

    let merchantData = (await firebase.database(merchantApp).ref(`/merchants/${merchantID}`).once('value')).val();
    if (merchantData === null) {
      // handle case: new merchant account creation
      merchantData = { id: merchantID };
      merchantData.email = email;
      await firebase.database(merchantApp).ref(`/tokens/${tokenIndex}/merchantID`).set(merchantID);
      await firebase.database(merchantApp).ref(`/merchants/${merchantID}`).set({ email: merchantData.email });
      dispatch({
        type: CREATE_MERCHANT,
        merchantData,
      });
    } else if (accountExists) {
      // handle case: merchant account already exists
      throw new Error('Email associated with another account.');
    }
  };
};

export const getMerchant = (email, password, authenticated) => {
  console.log('~Merchant Action: getMerchant');
  return async (dispatch) => {
    let merchantID;
    let credential;
    if (authenticated) {
      merchantID = firebase.auth(merchantApp).currentUser.uid;
    } else {
      try {
        credential = await firebase.auth(merchantApp).signInWithEmailAndPassword(email, password);
      } catch (error) {
        if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          throw new Error('Wrong password. Try again.');
        } else {
          throw error;
        }
      }
      merchantID = credential.user.uid;
    }
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${merchantID}`).once('value')).val();
    if (merchantData === null) {
      throw new Error('Wrong password. Try again.');
    }
    const merchant = new Merchant(merchantID, email);
    merchant.title = merchantData.title;
    merchant.price = merchantData.price;
    merchant.type = merchantData.type;
    merchant.address = merchantData.address;
    merchant.city = merchantData.city;
    merchant.deal = merchantData.deal;
    merchant.customers = merchantData.customers;
    merchant.transactions = merchantData.transactions;
    merchant.adminPassword = merchantData.adminPassword;
    merchant.employees = merchantData.employees;
    // console.log('Fetching Deal')
    // console.log(value.deal);
    // console.log(merchant.deal);

    dispatch({
      type: GET_MERCHANT,
      merchant,
    });
  };
};

export const logoutMerchant = () => {
  console.log('~Merchant Action: logoutMerchant');
  return async (dispatch) => {
    await firebase.auth(merchantApp).signOut();
    await dispatch({ type: LOGOUT_MERCHANT });
  };
};

export const updateMerchant = (merchantID, title, price, type, address, city, adminPassword) => {
  console.log('~Merchant Action: updateMerchant');
  return async (dispatch) => {
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${merchantID}`).once('value')).val();

    if (merchantData.deal === undefined) {
      merchantData.deal = null;
    }
    if (merchantData.customers === undefined) {
      merchantData.customers = null;
    }
    if (merchantData.transactions === undefined) {
      merchantData.transactions = null;
    }
    if (merchantData.employees === undefined) {
      merchantData.employees = null;
    }
    const updatedMerchantData = {
      email: merchantData.email,
      deal: merchantData.deal,
      customers: merchantData.customers,
      transactions: merchantData.transactions,
      employees: merchantData.employees,
    };
    updatedMerchantData.title = title;
    updatedMerchantData.price = price;
    updatedMerchantData.type = type;
    updatedMerchantData.address = address;
    updatedMerchantData.city = city;
    updatedMerchantData.adminPassword = adminPassword;
    await firebase.database(merchantApp).ref(`/merchants/${merchantID}`).set(updatedMerchantData);
    updatedMerchantData.id = merchantID;

    dispatch({
      type: UPDATE_MERCHANT,
      merchantData: updatedMerchantData,
    });
  };
};

export const updateCustomers = (merchantID, customerID) => {
  console.log('~Merchant Action: updateCustomers');
  return async (dispatch) => {
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${merchantID}`).once('value')).val();
    merchantData.id = merchantID;
    let customers;
    if (merchantData.customers === undefined) {
      customers = [customerID];
    } else {
      customers = merchantData.customers;
    }
    let isExistingCustomer = false;
    Object.values(customers).forEach((value) => {
      if (value === customerID) {
        isExistingCustomer = true;
      }
    });
    if (!isExistingCustomer) {
      customers.push(customerID);
    }
    merchantData.customers = customers;

    await firebase.database(merchantApp).ref(`/merchants/${merchantID}/customers`).set(customers);

    dispatch({
      type: UPDATE_MERCHANT,
      merchantData,
    });
  };
};

export const addTransaction = (merchantID, employee, customerID, amount, code, reward) => {
  console.log('~Merchant Action: addTransactions');
  return async (dispatch) => {
    const date = moment()
      .utcOffset('-04:00')
      .format('MM/DD/YY hh:mm:ss a');
    const newTransaction = (reward) ? {
      date,
      customerID,
      employee: employee.name,
      location: employee.location,
      reward,
      amount,
      code,
    } : {
      date,
      customerID,
      employee: employee.name,
      location: employee.location,
      amount,
      code,
    };
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${merchantID}`).once('value')).val();
    let { transactions } = merchantData;
    merchantData.id = merchantID;

    if (!(amount === 'Insufficient')) {
      if (transactions === undefined || transactions === null) {
        transactions = [newTransaction];
      } else {
        transactions.push(newTransaction);
      }
    } else if (transactions === undefined || transactions === null) {
      transactions = [];
    }
    merchantData.transactions = transactions;

    await firebase.database(merchantApp).ref(`/merchants/${merchantID}/transactions`).set(transactions);

    dispatch({
      type: UPDATE_MERCHANT,
      merchantData,
    });
  };
};

export const removeTransaction = (merchantID, code) => {
  console.log('~Merchant Action: removeTransaction');
  return async (dispatch) => {
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${merchantID}`).once('value')).val();
    const { transactions } = merchantData;
    merchantData.id = merchantID;

    transactions.sort((a, b) => parseFloat(b.code) - parseFloat(a.code));
    let updatedTransactions;
    if (!(transactions === undefined)) {
      updatedTransactions = [];
      let count = 0;
      Object.values(transactions).forEach((value) => {
        if (!(value.code === code)) {
          const transaction = value;
          transaction.code = count;
          updatedTransactions.push(transaction);
          count += 1;
        }
      });
    } else {
      updatedTransactions = [];
    }
    merchantData.transactions = updatedTransactions;

    await firebase.database(merchantApp).ref(`/merchants/${merchantID}/transactions`).set(updatedTransactions);

    dispatch({
      type: UPDATE_MERCHANT,
      merchantData,
    });
  };
};

export const updateDeal = (merchantID, amount, reward, code) => {
  console.log('~Merchant Action: updateDeal');
  return async (dispatch) => {
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${merchantID}`).once('value')).val();
    // console.log(id)
    let deals;
    if (merchantData.deal === undefined) {
      deals = [];
    } else {
      deals = merchantData.deal;
    }

    const newDeal = new Deal(amount, reward, code);
    if (deals.length === code) {
      deals.push(newDeal);
    } else {
      deals[code] = newDeal;
    }
    const updatedDeals = [];
    let count = 0;
    deals.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    Object.values(deals).forEach((value) => {
      updatedDeals.push(
        new Deal(value.amount, value.reward, count),
      );
      count += 1;
    });

    await firebase.database(merchantApp).ref(`/merchants/${merchantID}/deal`).set(updatedDeals);

    dispatch({
      type: UPDATE_DEALS,
      deal: updatedDeals,
    });
  };
};

export const removeDeal = (merchantID, code) => {
  console.log('~Merchant Action: removeDeal');
  return async (dispatch) => {
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${merchantID}`).once('value')).val();
    const deals = merchantData.deal;

    const updatedDeals = [];
    if (!(deals === undefined)) {
      deals.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));

      let count = 0;
      Object.values(deals).forEach((value) => {
        if (!(value.code === code)) {
          updatedDeals.push(
            new Deal(value.amount, value.reward, count),
          );
          count += 1;
        }
      });
    }
    await firebase.database(merchantApp).ref(`/merchants/${merchantID}/deal`).set(updatedDeals);

    dispatch({
      type: UPDATE_DEALS,
      deal: updatedDeals,
    });
  };
};

export const updateEmployee = (merchantID, name, location, type, id, code) => {
  console.log('~Merchant Action: updateEmployee');
  return async (dispatch) => {
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${merchantID}`).once('value')).val();
    let employees;
    if (merchantData.employees === undefined) {
      employees = [];
    } else {
      employees = merchantData.employees;
    }

    const newEmployee = new Employee(name, location, type, id, code);
    if (employees.length === code) {
      employees.push(newEmployee);
    } else {
      employees[code] = newEmployee;
    }
    employees.sort((a, b) => a.name.localeCompare(b.name));

    const updatedEmployees = [];
    let count = 0;
    Object.values(employees).forEach((value) => {
      updatedEmployees.push(
        new Employee(value.name, value.location, value.type, value.id, count),
      );
      count += 1;
    });

    await firebase.database(merchantApp).ref(`/merchants/${merchantID}/employees`).set(updatedEmployees);

    dispatch({
      type: UPDATE_EMPLOYEES,
      employees: updatedEmployees,
    });
  };
};

export const removeEmployee = (merchantID, code) => {
  console.log('~Merchant Action: removeEmployee');
  return async (dispatch) => {
    const merchantData = (await firebase.database(merchantApp).ref(`/merchants/${merchantID}`).once('value')).val();
    const { employees } = merchantData;
    const updatedEmployees = [];
    if (!(employees === undefined)) {
      employees.sort((a, b) => a.name.localeCompare(b.name));

      let count = 0;
      Object.values(employees).forEach((value) => {
        if (!(value.code === code)) {
          updatedEmployees.push(
            new Employee(value.name, value.location, value.type, value.id, count),
          );
          count += 1;
        }
      });
    }

    await firebase.database(merchantApp).ref(`/merchants/${merchantID}/employees`).set(updatedEmployees);

    dispatch({
      type: UPDATE_EMPLOYEES,
      employees: updatedEmployees,
    });
  };
};

export const loadAllMerchants = () => {
  console.log('~Merchant Action: loadAllMerchants');
  return async (dispatch) => {
    // any async code you want!
    const merchantData = (await firebase.database(userApp).ref('/merchants').once('value')).val();
    // console.log(merchantData)
    const loadedMerchants = [];
    Object.entries(merchantData).forEach(([key, value]) => {
      const merchant = new Merchant(
        key,
        value.email,
      );
      merchant.title = value.title;
      merchant.price = value.price;
      merchant.type = value.type;
      merchant.address = value.address;
      merchant.city = value.city;
      merchant.deal = value.deal;
      // console.log(merchant.deal)
      loadedMerchants.push(merchant);
    });
    // console.log(loadedMerchants);
    const filteredMerchants = loadedMerchants.filter((m) => !(m.deal === undefined));
    // console.log(filteredMerchants);
    dispatch({ type: LOAD_ALL_MERCHANTS, merchants: filteredMerchants });
  };
};
