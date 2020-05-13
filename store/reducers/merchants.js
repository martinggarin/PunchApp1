import {RESTAURANTS} from '../../data/Dummy-Data';
import {
        UPDATE_DEALS,
        CREATE_MERCHANT, 
        GET_MERCHANT, 
        UPDATE_MERCHANT,
        LOAD_ALL_MERCHANTS} from '../actions/merchants';
import Restaurants from '../../models/Restaurants';

const initialState = {

    availableMerchants: [], 
    myMerchant: {}, 
    myDeals: []

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
        case GET_MERCHANT:
            return{
                ...state, 
                myMerchant: action.merchant,
                myDeals: action.merchant.deal
            };
        case CREATE_MERCHANT:
            const newMerchant = new Restaurants(
                action.merchantData.id,
                action.merchantData.email, 
                action.merchantData.password, 
                );
            return {
                ...state,
                myMerchant: newMerchant, 
                availableMerchants: state.availableMerchants.concat(newMerchant)
            };
        case UPDATE_MERCHANT:
            var updatedMerchant = action.merchantData
            return {
                ...state,
                myMerchant: updatedMerchant,
                myDeals: updatedMerchant.deal
            }
        case UPDATE_DEALS:
            var updatedMerchant = state.myMerchant;
            updatedMerchant.deal = action.deal
            return{
                ...state, 
                myMerchant: updatedMerchant,
                myDeals: updatedMerchant.deal
            }
        case LOAD_ALL_MERCHANTS:
            return {
                ...state,
                availableMerchants: action.merchants
            }
    };//switch

    return state;
}