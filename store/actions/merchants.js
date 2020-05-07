export const CREATE_MERCHANT = 'ADD_MERCHANT';
export const TOGGLE_FAV = 'ADD_RESTAURANT';
export const UPDATE_MERCHANT = 'UPDATE_MERCHANT';
export const LOAD_SINGLE_MERCHANT = 'LOAD_SINGLE_MERCHANT';
export const LOAD_ALL_MERCHANTS = 'LOAD_ALL_MERCHANTS';
export const GET_MERCHANT = 'GET_MERCHANT';
export const ADD_DEAL = 'ADD_DEAL';

import Restaurants from '../../models/Restaurants';
import Deal from '../../models/Deal';

export const getMerchant = (email, password) => {
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
            merchant.deal = [];
            for(const k in resData[key].deal){
              merchant.deal.push(resData[key].deal[k]);
            }
            merchant.price = resData[key].price
            merchant.type = resData[key].type
            merchant.address = resData[key].address
            merchant.city = resData[key].city

            //merchant.deal.concat(resData[key].deal);
            console.log('fetching deal')
            console.log(resData[key].deal);
            console.log(merchant.deal);
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
          console.log('loadingMerchants')
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
        console.log(resData);
    
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
export const editProfile = (id, title, price, type, address, city) =>{
  return async dispatch =>{
    const response1 = await fetch(`https://punchapp-86a47.firebaseio.com/merchants/${id}.json`);
    if(!response1.ok){
      throw new Error('response 1 was not fetched');
    };
    const merchantData = await response1.json();
    merchantData.id = id
    merchantData.title = title
    merchantData.price = price
    merchantData.type = type
    merchantData.address = address
    merchantData.city = city

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
    if(!response.ok){
        throw new Error('error updating deal');
    };

    dispatch({
      type: UPDATE_MERCHANT,
      merchantData: merchantData 
    })
  }
}

export const editDeal = (id, ammount, reward) =>{
  return async dispatch =>{

    const response1 = await fetch(`https://punchapp-86a47.firebaseio.com/merchants/${id}.json`);
    if(!response1.ok){
      throw new Error('response 1 was not fetched');
    };

    const resData1 = await response1.json();
    const deals = resData1.deal; 

    console.log('-----deals-----');
    console.log(deals);

    
    const deal = [];
    if(!(deals === undefined)){
      for(const key in deals){
        deal.push(
          new Deal(
            deals[key].ammount, deals[key].reward, deals[key].code
          )
        );
      }//for
    }
    deal.push(new Deal(ammount, reward, '|.||..|.||..|'))
    console.log(deal);
    //const d = new Deal(ammount, reward, '|.||..|.||..|');

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
      type: ADD_DEAL,
      merchant:id, 
      deal: deal
    })
  }
}