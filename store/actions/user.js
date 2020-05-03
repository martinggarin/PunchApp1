export const CREATE_USER = 'CREATE_USER';
export const GET_USER = 'GET_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const TOGGLE_FAV = 'TOGGLE_FAV';
export const FETCH_MERCHANTS = 'FETCH_MERCHANTS';

import Customer from '../../models/Customer';
import Restaurants from '../../models/Restaurants';


export const fetchMerchants = () => {
  return async dispatch => {
    // any async code you want!
    try {
      const response = await fetch(
        'https://punchapp-86a47.firebaseio.com/merchants.json'
      );
      console.log('merchant loading');

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      const merchants = [];

      for (const key in resData) {
        const m =
          new Restaurants(
            key,
            resData[key].email,
            resData[key].password,
            resData[key].title
        );
        m.deal = resData[key].deal;
        merchants.push(m);
      };
      if(merchants === 0){
        throw new Error('email and password arent valid'); 
      }
      
      dispatch({ type: FETCH_MERCHANTS, merchants: merchants });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};


export const toggleFav = (r_id, u_id) => {

  return async dispatch => {

    const response1 = await fetch(`https://punchapp-86a47.firebaseio.com/users/${u_id}.json`);
    if(!response1.ok){
      throw new Error('response 1 was not fetched');
    };

    const resData = await response1.json();
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
    console.log(favorites);

    const response = await fetch(
      `https://punchapp-86a47.firebaseio.com/users/${u_id}.json`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          favorites
        })
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({
      type: TOGGLE_FAV,
      favorites: favorites
    });
  };
};

export const createUser = (email, password) => {
    return async dispatch => {
        // any async code you want!
        const RS = [];
        const favorites = [];
        const response = await fetch(
          'https://punchapp-86a47.firebaseio.com/users.json',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email,
              password,
              RS,
              favorites
            })
          }
        );
    
        const resData = await response.json();
        console.log(resData);
    
        dispatch({
          type: CREATE_USER,
          userData: {
            id: resData.name,
            email,
            password
          }
        });
      };
};

export const getUser = (email, password) => {
    return async dispatch => {
      // any async code you want!
      try {
        const response = await fetch(
          'https://punchapp-86a47.firebaseio.com/users.json'
        );
  
        if (!response.ok) {
          throw new Error('Something went wrong!');
        }
  
        const resData = await response.json();
        let user = 0;
  
        for (const key in resData) {
          if (resData[key].email === email && resData[key].password === password){
            user = new Customer(key, email, password);
            user.RS = resData[key].RS;
            user.favorites = [];
            if(!(resData[key].favorites === undefined))
            {  for(const k in resData[key].favorites){
                user.favorites.push(resData[key].favorites[k]);
              };}
            //console.log(user);
          }
        };
        if(user === 0){
          throw new Error('email and password arent valid'); 
        }
        
        dispatch({ type: GET_USER, user: user });
      } catch (err) {
        // send to custom analytics server
        throw err;
      }
    };
  };