export const CREATE_MERCHANT = 'ADD_MERCHANT';
export const TOGGLE_FAV = 'ADD_RESTAURANT';
export const LOAD_SINGLE_MERCHANT = 'LOAD_SINGLE_MERCHANT';
export const LOAD_ALL_MERCHANTS = 'LOAD_ALL_MERCHANTS';
export const GET_MERCHANT = 'GET_MERCHANT';
export const UPDATE_MERCHANT = 'UPDATE_MERCHANT';
export const UPDATE_DEALS = 'UPDATE_DEALS';

import Restaurants from '../../models/Restaurants';
import Deal from '../../models/Deal';

export const getMerchant = (email, password) => {
    console.log('~Merchant Action: getMerchant')
    return async dispatch => {
      // any async code you want!
      try {
        const response = await fetch(
          'https://punchapp-86a47.firebaseio.com/merchants.json'
        );

        if (!response.ok) {
          throw new Error('Something went wrong!');
        }
  
        const resData = await response.json();
        let merchant = 0;
  
        for (const key in resData) {
          if (resData[key].email === email && resData[key].password === password){
            merchant = new Restaurants(key, email, password, resData[key].title);
            merchant.price = resData[key].price
            merchant.type = resData[key].type
            merchant.address = resData[key].address
            merchant.city = resData[key].city
            if (resData[key].deal === undefined){
              merchant.deal = [];
            }
            else{
              merchant.deal = resData[key].deal
            }
            if (resData[key].customers === undefined){
              merchant.customers = []
            }
            else{
              merchant.customers = resData[key].customers
            }

            //merchant.deal.concat(resData[key].deal);
            //console.log('Fetching Deal')
            //console.log(resData[key].deal);
            //console.log(merchant.deal);
          }
        };
        if(merchant === 0){
          throw new Error('email and password arent valid'); 
        }
        
        dispatch({ type: GET_MERCHANT, merchant: merchant });
      } catch (err) {
        // send to custom analytics server
        throw err;
      }
    };
};

export const loadAllMerchants = () => {
    console.log('~Merchant Action: loadAllMerchants')
    //this is gonna load the specific merchant with the inputed id
    //since our app is allready gonna have downloaded all the merchants
    //we will be able to pass the id as a parameter, this will not be the same for the user
    return async dispatch => {
        // any async code you want!
        try {
          const response = await fetch(
            'https://punchapp-86a47.firebaseio.com/merchants.json'
          );
    
          if (!response.ok) {
            throw new Error('Something went wrong!');
          }
    
          const resData = await response.json();
          const loadedMerchants = [];
    
          for (const key in resData) {
            
            const r = new Restaurants(
                key,
                resData[key].email,
                resData[key].password,
                resData[key].title
              );
        
            r.deal = [];
            for(const k in resData[key].deal){
              r.deal.push(resData[key].deal[k]);
            }
            //r.deal.concat(resData[key].deal);
            loadedMerchants.push(r);
          }
          // console.log(loadedMerchants);

          dispatch({ type: LOAD_ALL_MERCHANTS, merchants: loadedMerchants });
        } catch (err) {
          // send to custom analytics server
          throw err;
        }
      };
};

// export const updateMerchant = (id, title, email, password) =>{
//     //this is gonna add a restaurant to the DB, only called when registering. 
//     //it will update an existing value in the DB since only ppl with the id can register, 
//     //this will eliminate fraud. 
// };

// export const loadAllMerchants = () {
//     //this will load all of the merchants available
// };

// export const loadFavoritedMerchants = (ids){
//     //this will load all favorited Merchants
//     //the input will be an array of restaurant ids saved in user object
// };

export const createMerchant = (email, password, title) => {
    console.log('~Merchant Action: createMerchant')
    return async dispatch => {
        // any async code you want!
        const response = await fetch(
          'https://punchapp-86a47.firebaseio.com/merchants.json',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title,
              email,
              password
            })
          }
        );
    
        const resData = await response.json();
        //console.log(resData);
    
        dispatch({
          type: CREATE_MERCHANT,
          merchantData: {
            id: resData.name,
            title,
            email,
            password
          }
        });
      };
};

//make it so you can edit merchant profile information
export const updateMerchant = (id, title, price, type, address, city) =>{
  console.log('~Merchant Action: updateMerchant')
  return async dispatch =>{
    const response1 = await fetch(`https://punchapp-86a47.firebaseio.com/merchants/${id}.json`);
    if(!response1.ok){
      throw new Error('response 1 was not fetched');
    };
    const merchantData = await response1.json();

    const updatedMerchantData = {
      email:merchantData.email,
      password:merchantData.password,
      deal:merchantData.deal,
      customers:merchantData.customers
    }
    updatedMerchantData.id = id
    updatedMerchantData.title = title
    updatedMerchantData.price = price
    updatedMerchantData.type = type
    updatedMerchantData.address = address
    updatedMerchantData.city = city

    const response = await fetch(`https://punchapp-86a47.firebaseio.com/merchants/${id}.json`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          price,
          type,
          address,
          city
        })
      }
    );

    dispatch({
      type: UPDATE_MERCHANT,
      merchantData: updatedMerchantData 
    })
  }
}

export const updateCustomers = (id, customerID) => {
  console.log('~Merchant Action: updateCustomers')
  return async dispatch =>{
    const response1 = await fetch(`https://punchapp-86a47.firebaseio.com/merchants/${id}.json`);
    if(!response1.ok){
      throw new Error('response 1 was not fetched');
    };
    const merchantData = await response1.json();
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

    const response = await fetch(`https://punchapp-86a47.firebaseio.com/merchants/${id}.json`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customers
        })
      }
    );

    dispatch({
      type:UPDATE_MERCHANT,
      merchantData:merchantData
    })
  }
}

export const updateDeal = (id, ammount, reward, code) =>{
  console.log('~Merchant Action: updateDeal')
  return async dispatch =>{
    const response1 = await fetch(`https://punchapp-86a47.firebaseio.com/merchants/${id}.json`);
    if(!response1.ok){
      throw new Error('response 1 was not fetched');
    };
    const resData1 = await response1.json();
    //console.log(id)
    if (resData1.deal === undefined){
      var deal = []
    }
    else{
      var deal = resData1.deal
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

    const response = await fetch(`https://punchapp-86a47.firebaseio.com/merchants/${id}.json`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deal
        })
      }
    );
    if(!response.ok){
        throw new Error('error updating deal');
    };

    dispatch({
      type: UPDATE_DEALS,
      deal: deal
    })
  }
}

export const removeDeal = (id, code) =>{
  console.log('~Merchant Action: removeDeal')
  return async dispatch =>{

    const response1 = await fetch(`https://punchapp-86a47.firebaseio.com/merchants/${id}.json`);
    if(!response1.ok){
      throw new Error('response 1 was not fetched');
    };
    const resData1 = await response1.json();
    const deals = resData1.deal; 

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

    const response = await fetch(`https://punchapp-86a47.firebaseio.com/merchants/${id}.json`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deal
        })
      }
    );
    if(!response.ok){
        throw new Error('error updating deal');
    };

    dispatch({
      type: UPDATE_DEALS,
      deal: deal
    })
  }
}