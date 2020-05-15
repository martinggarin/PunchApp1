import {
    CREATE_USER,
    GET_USER,
    LOGOUT_USER,
    REFRESH_USER,
    UPDATE_RS,
    TOGGLE_FAV} from '../actions/user';
import Customer from '../../models/Customer';
import RewardsStatus from '../../models/RewardsStatus';

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
            newUser.RS = [];
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

        case LOGOUT_USER:
            return initialState

        case REFRESH_USER: 
            return {...state,
                user: action.user, 
                userMerchants: action.user.favorites,
                userRewards: action.user.RS};   

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
            return{...state,
                userRewards: action.RS
            }

        default:
            return state;
    };
};