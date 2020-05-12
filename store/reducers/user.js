import {
    REFRESH_USER,
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
            //console.log('_______RS______');

            if(!(action.user.RS === undefined)){
                for (const key in action.user.RS){
                    fetchUser.RS.push(
                        new RewardsStatus(action.user.RS[key].r_id, action.user.RS[key].ammount)
                        );
                };
            }//if rs
            console.log(fetchUser.RS);
            if(!(action.user.favorites === undefined)){
                for(const key in action.user.favorites){
                    fetchUser.favorites.push(
                        action.user.favorites[key]
                    );
                }
            }//if favorites
            
            return {
                user: fetchUser, 
                userMerchants: fetchUser.favorites,
                userRewards: fetchUser.RS};
                
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
            console.log(refreshUser.RS);
            if(!(action.user.favorites === undefined)){
                for(const key in action.user.favorites){
                    refreshUser.favorites.push(
                        action.user.favorites[key]
                    );
                }
            }//if favorites
            
            return {
                user: refreshUser, 
                userMerchants: refreshUser.favorites,
                userRewards: refreshUser.RS};
                
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
            //console.log('______updated RS_______');
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