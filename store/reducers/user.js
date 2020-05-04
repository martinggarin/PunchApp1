import {
    UPDATE_RS,
    GET_USER,
    CREATE_USER,
    TOGGLE_FAV,
    FETCH_MERCHANTS} from '../actions/user';
import Customer from '../../models/Customer';
import RewardsStatus from '../../models/RewardsStatus';
import { ActionSheetIOS } from 'react-native';

const initialState = {
    user: {}, 
    userMerchants: [], 
    userRewards: []
};

export default (state = initialState, action) => {

    switch(action.type){
        case CREATE_USER:
            const newUser = new Customer(
                action.userData.id, 
                action.userData.email, 
                action.userData.password);
            newUser.RD = [];
            newUser.favorites = [];
            return {...state, user: newUser};

        case GET_USER:
            const fetchUser = new Customer(
                action.user.id,
                action.user.email,
                action.user.password);
            fetchUser.favorites = [];
            fetchUser.RS = [];
            if(!(action.user.RS === undefined)){
                for (const key in action.user.RS){
                    fetchUser.RS.push(
                        new RewardsStatus(action.user.RS[key].r_id, action.user.RS[key].ammount)
                        );
                };
            }//if rs
            if(!(action.user.favorites === undefined)){
                for(const key in action.user.favorites){
                    fetchUser.favorites.push(
                        action.user.favorites[key]
                    );
                }
            }//if favorites
            
            return {...state, 
                user: fetchUser, 
                userMerchants: fetchUser.favorites};

        case FETCH_MERCHANTS:
            return {
                ...state, 
                userMerchants: action.merchants.filter(m => m.id === state.user.favorites)
            };

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
            console.log('______updated RS_______');
            console.log(action.RS)
            
            return{
                ...state,
                userRewards: action.RS
            }
            
        default:
            return state;
    };
    return state;
};