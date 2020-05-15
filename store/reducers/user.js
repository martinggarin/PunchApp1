import {
    REFRESH_USER,
    UPDATE_RS,
    GET_USER,
    CREATE_USER,
    TOGGLE_FAV,
    FETCH_MERCHANTS,
    LOGOUT_USER} from '../actions/user';
import Customer from '../../models/Customer';
import RewardsStatus from '../../models/RewardsStatus';
import { ActionSheetIOS } from 'react-native';

const initialState = {
    token: null,
    user: {}, 
    userMerchants: [], 
    userRewards: []
};

export default (state = initialState, action) => {

    switch(action.type){
        case CREATE_USER:
            const newUser = new Customer(action.userData.id, action.userData.email);
            newUser.RD = [];
            newUser.favorites = [];
            return {...state,
                user:newUser,
                token:action.token,
            };
        case GET_USER:
            return {...state,
                user: action.user, 
                userMerchants: action.user.favorites,
                userRewards: action.user.RS,
                token:action.token, 
            };
        case REFRESH_USER: 
            const refreshUser = new Customer(
                action.user.id,
                action.user.email,
                action.user.password);
            refreshUser.favorites = [];
            refreshUser.RS = [];
            //console.log('_______RS______');

            if(!(action.user.RS === undefined)){
                for (const key in action.user.RS){
                    refreshUser.RS.push(
                        new RewardsStatus(action.user.RS[key].r_id, action.user.RS[key].ammount)
                        );
                };
            }//if rs
            //console.log(refreshUser.RS);
            if(!(action.user.favorites === undefined)){
                for(const key in action.user.favorites){
                    refreshUser.favorites.push(
                        action.user.favorites[key]
                    );
                }
            }//if favorites
            
            return {...state,
                user: refreshUser, 
                userMerchants: refreshUser.favorites,
                userRewards: refreshUser.RS};   
        case LOGOUT_USER:
            return initialState
        case TOGGLE_FAV:
            // const updatedUserMerchants = [...];
            // for(const key in action.favorites){
            //      updatedUserMerchants.push(state.merchants.find(m => m.id === key));
            // }
            // console.log(updatedUserMerchants);
            return{
                ...state,
                userMerchants: action.favorites
            };
        case UPDATE_RS:
            //console.log('______updated RS_______');
            //console.log(action.RS)
            return{
                ...state,
                userRewards: action.RS
            }
        default:
            return state;
    };
    return state;
};