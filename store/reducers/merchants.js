import {RESTAURANTS} from '../../data/Dummy-Data';
import {
        ADD_DEAL,
        CREATE_MERCHANT, 
        GET_MERCHANT, 
        UPDATE_RESTAURANT,
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
            const fetchMerchant = new Restaurants(
                action.merchant.id, 
                action.merchant.email,
                action.merchant.password,
                action.merchant.title
            );
            const d = [];
            for(const key in action.merchant.deal){
                d.push(action.merchant.deal[key]);
            }
            fetchMerchant.deal = d;
            console.log('fetch Merchant');
            console.log(fetchMerchant);
            return{
                ...state, 
                myMerchant: fetchMerchant,
                myDeals: d
            };
        case CREATE_MERCHANT:
            const newMerchant = new Restaurants(
                action.merchantData.id,
                action.merchantData.email, 
                action.merchantData.password, 
                action.merchantData.title
                );
            return {
                myMerchant: newMerchant, 
                availableMerchants: state.availableMerchants.concat(newMerchant)
            };

        case LOAD_ALL_MERCHANTS:
            console.log('loaded merchants');
            return {
                ...state,
                availableMerchants: action.merchants
            }
        case ADD_DEAL:
            console.log('deal added');
            //state.myMerchant.deal.concat( action.deal);
            const updateMerchant = state.myMerchant;
            updateMerchant.deal = [];
            for(const key in action.deal){
                updateMerchant.deal.push(action.deal[key]);
            }
            //state.myMerchant.deal = d;
            console.log(updateMerchant);
            // const updatedMerchantIndex = state.availableMerchants.findIndex(m => m.id === action.merchant);
            // const updatedMerchantList = [...state.availableMerchants];
            // updatedMerchantList[updatedMerchantIndex].deal = action.deal;
            return{
                ...state, 
                myMerchant: updateMerchant,
                myDeals: action.deal
            }
    };//switch

    return state;
}