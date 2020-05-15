export const CREATE_USER = 'CREATE_USER';
export const GET_USER = 'GET_USER';
export const LOGOUT_USER = 'LOGOUT_USER'
export const REFRESH_USER = 'REFRESH_USER';
export const TOGGLE_FAV = 'TOGGLE_FAV';
export const UPDATE_RS = 'UPDATE_RS';

import Customer from '../../models/Customer';
import RewardStatus from '../../models/RewardsStatus';

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
      throw new Error('That username is taken.');
    }
    const authenticatedUser = await authResponse.json();
    const token = authenticatedUser.idToken
    //console.log(authenticatedUser)

    const response = await fetch(
      `https://punchapp-86a47.firebaseio.com/users.json?auth=${token}`,
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
      `https://punchapp-86a47.firebaseio.com/userKeys.json?auth=${token}`,
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
      },
      token:token,
    });
  };
};

export const getUser = (email, password) => {
  console.log('~User Action: getUser')
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
      throw new Error('Wrong password. Try again.');
    }
    const authenticatedUser = await authResponse.json();
    const token = authenticatedUser.idToken
      
    const keyResponse = await fetch(
      `https://punchapp-86a47.firebaseio.com/userKeys.json?auth=${token}`
    );
    if (!keyResponse.ok) {
      throw new Error('Something went wrong!');
    }
    const keyData = await keyResponse.json();
    
    let userKey = 0
    for (const index in keyData){
      if (keyData[index].email === email){
        userKey = keyData[index].key
        break
      }
    }
    if (userKey === 0){
      throw new Error('Wrong password. Try again.');
    }
    const response = await fetch(
      `https://punchapp-86a47.firebaseio.com/users/${userKey}.json?auth=${token}`
    );
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    const resData = await response.json()
    //console.log(resData)
    const user = new Customer(userKey, email);
    user.RS = resData.RS;
    user.favorites = resData.favorites;
    //console.log(user);
    
    dispatch({
      type: GET_USER,
      user: user,
      token: token
    });
  };
};

export const logoutUser = () => {
  console.log('~User Action: logoutUser')
  return async dispatch => {
    dispatch({ type: LOGOUT_USER})
  }
}

export const refreshUser = (id) => {
  console.log('~User Action: refreshUser')
  return async (dispatch, getState) => {
    const token = getState().user.token
    // any async code you want!
    try {
      const response = await fetch(
        `https://punchapp-86a47.firebaseio.com/users/${id}.json?auth=${token}`
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      //console.log("_________Refreshing User________");
      const user = new Customer(id, resData.email);

      user.RS = resData.RS;
      user.favorites = resData.favorites;
      
      // if(!(resData.favorites === undefined)){
      //   for(const key in resData.favorites){
      //     user.favorites.push(resData.favorites[key]);
      //   }
      // }
      
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
      var token = getState().merchants.token
    }else{
      var token = getState().user.token
    }
    const response1 = await fetch(`https://punchapp-86a47.firebaseio.com/users/${u_id}.json?auth=${token}`);
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
      `https://punchapp-86a47.firebaseio.com/users/${u_id}.json?auth=${token}`,
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

export const updateRewards = (r_id, u_id, ammount) => {
  console.log('~User Action: updateRewards')
  //update the value of user rewards status... TODO
  //console.log(u_id)
  return async (dispatch, getState) =>{
    const token = getState().merchants.token
    const response1 = await fetch(`https://punchapp-86a47.firebaseio.com/users/${u_id}.json?auth=${token}`);
    if(!response1.ok){
      throw new Error('Something Went Wrong!');
    };
    const resData1 = await response1.json();
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

    const response = await fetch(`https://punchapp-86a47.firebaseio.com/users/${u_id}.json?auth=${token}`,
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