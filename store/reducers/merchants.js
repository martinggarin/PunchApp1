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
            console.log('fetch Merchant');
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
                action.merchantData.title
                );
            return {
                ...state,
                myMerchant: newMerchant, 
                availableMerchants: state.availableMerchants.concat(newMerchant)
            };
        case UPDATE_MERCHANT:
            console.log('Updating Profile')
            const updatedMerchant = action.merchantData
            console.log(updatedMerchant)
            return {
                ...state,
                myMerchant: updatedMerchant,
                myDeals: updatedMerchant.deal
            }
        case UPDATE_DEALS:
            console.log('Deals Updated')
            const updateMerchant = state.myMerchant;
            updateMerchant.deal = action.deal;
            const updateDeals = action.deal;
            return{
                ...state,
                myMerchant:updateMerchant,
                myDeals:updateDeals
            }
        case LOAD_ALL_MERCHANTS:
            console.log('loaded merchants');
            return {
                ...state,
                availableMerchants: action.merchants
            }
    };//switch

    return state;
}