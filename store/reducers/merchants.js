import {RESTAURANTS} from '../../data/Dummy-Data';
import {
        UPDATE_DEALS,
        CREATE_MERCHANT, 
        GET_MERCHANT, 
        UPDATE_MERCHANT,
        LOAD_ALL_MERCHANTS,
        LOGOUT_MERCHANT} from '../actions/merchants';
import Restaurants from '../../models/Restaurants';

const initialState = {
    token:null,
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
        case CREATE_MERCHANT:
            const newMerchant = new Restaurants(action.merchantData.id, action.merchantData.email);
            return {
                ...state,
                myMerchant: newMerchant, 
                myDeals: newMerchant.deal,
                availableMerchants: state.availableMerchants.concat(newMerchant)
            };
        case GET_MERCHANT:
            return{
                ...state, 
                myMerchant: action.merchant,
                myDeals: action.merchant.deal
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
        case LOGOUT_MERCHANT:
            return initialState
        case LOAD_ALL_MERCHANTS:
            return {
                ...state,
                availableMerchants: action.merchants
            }
    };//switch

    return state;
}