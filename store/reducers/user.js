import {
    CREATE_USER,
    GET_USER,
    LOGOUT_USER,
    UPDATE_RS} from '../actions/user';
import Customer from '../../models/Customer';

const initialState = {
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
            };

        case GET_USER:
            return {...state,
                user: action.user, 
                userMerchants: action.user.favorites,
                userRewards: action.user.RS, 
            };

        case LOGOUT_USER:
            return initialState

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