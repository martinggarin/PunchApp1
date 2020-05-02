export const CREATE_MERCHANT = 'ADD_MERCHANT';
export const TOGGLE_FAV = 'ADD_RESTAURANT';
export const UPDATE_RESTAURANT = 'UPDATE_RESTAURANT';
export const LOAD_SINGLE_MERCHANT = 'LOAD_SINGLE_MERCHANT';
export const LOAD_ALL_MERCHANTS = 'LOAD_ALL_MERCHANTS';

import Restaurants from '../../models/Restaurants';
import Deal from '../../models/Deal';

export const toggleFav = (id) => {
    return {type: TOGGLE_FAV, restaurant_id: id};
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
        
            r.deal = resData[key].deal;
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

export const editDeal = (id, reward, ammount) =>{
  return async dispatch =>{

    const deal = new Deal(ammount, reward, '|.||..|.||..|');

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