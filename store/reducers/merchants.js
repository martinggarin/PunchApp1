import {RESTAURANTS} from '../../data/Dummy-Data';
import {TOGGLE_FAV, 
        ADD_DEAL,
        REMOVE_RESTAURANT,
        CREATE_MERCHANT, 
        ADD_RESTAURANT, 
        UPDATE_RESTAURANT,
        LOAD_ALL_MERCHANTS} from '../actions/merchants';
import Restaurants from '../../models/Restaurants';

const initialState = {

    availableMerchants: [], 

};
//most problems have been due to my inability to spell retaurant
export default (state = initialState, action) => {

    switch(action.type){
        // case TOGGLE_FAV:
        //     const existingIndex = state.userRestaurants.findIndex(r => r.id === action.restaurant_id);
        //     if(existingIndex >= 0){
        //         const updatedRestaurants = [...state.userRestaurants];
        //         updatedRestaurants.splice(existingIndex, 1);
        //         return{...state, userRestaurants: updatedRestaurants};
        //     }else{
        //         return{...state, userRestaurants: state.userRestaurants.concat(state.availableRestaurants.find(r=>r.id===action.restaurant_id))};
        //     }
        case CREATE_MERCHANT:
            const newMerchant = new Restaurants(
                action.merchantData.id,
                action.merchantData.email, 
                action.merchantData.password, 
                action.merchantData.title
                );
            return {...state, 
                availableMerchants: state.availableMerchants.concat(newMerchant)};

        case LOAD_ALL_MERCHANTS:
            console.log('loaded merchants');
            return {
                availableMerchants: action.merchants
            }
        case ADD_DEAL:
            console.log('deal added');
            const updatedMerchantIndex = state.availableMerchants.findIndex(m => m.id === action.merchant);
            const updatedMerchantList = [...state.availableMerchants];
            updatedMerchantList[updatedMerchantIndex].deal = action.deal;
            return{
                availableMerchants: updatedMerchantList
            }
    };//switch

    return state;
}