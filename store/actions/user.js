export const CREATE_USER = 'CREATE_USER';
export const GET_USER = 'GET_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const TOGGLE_FAV = 'TOGGLE_FAV';
export const FETCH_MERCHANTS = 'FETCH_MERCHANTS';
export const UPDATE_RS = 'UPDATE_RS';
export const REFRESH_USER = 'REFRESH_USER';

import Customer from '../../models/Customer';
import Restaurants from '../../models/Restaurants';
import RewardStatus from '../../models/RewardsStatus';

export const updateRewards = (r_id, u_id, ammount) => {
  console.log('~User Action: updateRewards')
  //update the value of user rewards status... TODO
  return async dispatch =>{

    const response1 = await fetch(`https://punchapp-86a47.firebaseio.com/users/${u_id}.json`);
    if(!response1.ok){
      throw new Error('response 1 was not fetched');
    };

    const resData1 = await response1.json();
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

    const response = await fetch(`https://punchapp-86a47.firebaseio.com/users/${u_id}.json`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          RS
        })
      }
    );
    if(!response.ok){
        throw new Error('error updating RS');
    };
    dispatch({
      type: UPDATE_RS,
      merchant:r_id,
      user:u_id, 
      RS: RS
    })
    throw 'none'
  }

}

export const fetchMerchants = () => {
  console.log('~User Action: fetchMerchants')
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
        );
        m.title = resData[key].title
        m.price = resData[key].price
        m.type = resData[key].type
        m.address = resData[key].address
        m.city = resData[key].city
        m.deal = resData[key].deal;
        m.customers = resData[key].customers
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
  console.log('~User Action: toggleFav')
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
    //console.log(favorites);

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
  console.log('~User Action: createUser')
  return async dispatch => {
    // any async code you want!
    const authResponse = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCvSHOaKLtLtXsdln3K_GtNfRMQ_kONSZw',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );
    if (!authResponse.ok) {
      throw new Error('Something went wrong!');
    }
    //const authenticatedUser = await authResponse.json();
    //console.log(authenticatedUser)

    const response = await fetch(
      'https://punchapp-86a47.firebaseio.com/users.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email:email,
        })
      }
    );
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    const resData = await response.json();
    //console.log(resData);

    const keyResponse = await fetch(
      'https://punchapp-86a47.firebaseio.com/userKeys.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email:email,
          key:resData.name,
        })
      }
    );
    if (!keyResponse.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({
      type: CREATE_USER,
      userData: {
        id: resData.name,
        email: email,
      }
    });
  };
};

export const getUser = (email, password) => {
  return async dispatch => {
    // any async code you want!
    const authResponse = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCvSHOaKLtLtXsdln3K_GtNfRMQ_kONSZw',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );
    if (!authResponse.ok) {
      throw new Error('Something went wrong!');
    }
    const authenticatedUser = await authResponse.json();
      
    const keyResponse = await fetch(
      'https://punchapp-86a47.firebaseio.com/userKeys.json'
    );
    if (!keyResponse.ok) {
      throw new Error('Something went wrong!');
    }
    const keyData = await keyResponse.json();
    
    let userKey = 0
    for (const index in keyData){
      if (keyData[index].email === authenticatedUser.email ){
        userKey = keyData[index].key
        break
      }
    }
    if (userKey === 0){
      throw new Error('email and password arent valid');
    }
    const response = await fetch(
      `https://punchapp-86a47.firebaseio.com/users/${userKey}.json`
    );
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    const resData = await response.json()
    
    const user = new Customer(userKey, email);
    user.RS = resData.RS;
    user.favorites = resData.favorites;
    //console.log(user);
    
    dispatch({ type: GET_USER, user: user });
  };
};

export const refreshUser = (id) => {
  return async dispatch => {
    // any async code you want!
    try {
      const response = await fetch(
        `https://punchapp-86a47.firebaseio.com/users/${id}.json`
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      console.log("_________Refreshing Uer________");
      const user = new Customer(id, resData.email, resData.password);

      user.RS = resData.RS;
      user.favorites = [];
      
      if(!(resData.favorites === undefined)){
        for(const key in resData.favorites){
          user.favorites.push(resData.favorites[key]);
        }
      }
      if(user === 0){
        throw new Error('email and password arent valid'); 
      }
      
      dispatch({ type: REFRESH_USER, user: user });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
}