import {
    GET_USER,
    CREATE_USER,
    TOGGLE_FAV,
    FETCH_MERCHANTS} from '../actions/user';
import Customer from '../../models/Customer';
import RewardsStatus from '../../models/RewardsStatus';

const initialState = {
    user: {}, 
    userMerchants: []
};

export default (state = initialState, action) => {

    switch(action.type){
        case CREATE_USER:
            const newUser = new Customer(
                action.userData.id, 
                action.userData.email, 
                action.userData.password);
            return {...state, user: newUser};

        case GET_USER:
            const fetchUser = new Customer(
                action.user.id,
                action.user.email,
                action.user.password);
            const rs = [];
            for (const key in action.user.RS){
                const nrs = new RewardsStatus(action.user.RS[key].r_id, action.user.RS[key].c_id);
                nrs.ammount = action.user.RS[key].ammount;
                rs.push(nrs);
            };
            fetchUser.RS = rs;
            fetchUser.favorites = action.user.favorites;
            console.log(fetchUser.favorites);
            return {...state, 
                user: fetchUser, 
                userMerchants: fetchUser.favorites};

        case FETCH_MERCHANTS:
            return {
                ...state, 
                merchants: action.merchants,
                userMerchants: action.merchants.filter(m => m.id === state.user.favorites)
            };

        case TOGGLE_FAV:
            // const updatedUserMerchants = [];
            // for(const key in action.favorites){
            //     updatedUserMerchants.push(state.merchants.find(m => m.id === key));
            // }
            // console.log(updatedUserMerchants);
            return{
                ...state,
                userMerchants: action.favorites
            };

        default:
            return state;
    };
    return state;
};