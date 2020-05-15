import {
    CREATE_MERCHANT,
    GET_MERCHANT, 
    LOGOUT_MERCHANT, 
    UPDATE_MERCHANT,
    UPDATE_DEALS,
    LOAD_ALL_MERCHANTS} from '../actions/merchants';
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

        case CREATE_MERCHANT:
            const newMerchant = new Restaurants(action.merchantData.id, action.merchantData.email);
            return {
                ...state,
                myMerchant: newMerchant, 
                myDeals: newMerchant.deal,
                availableMerchants: state.availableMerchants.concat(newMerchant),
                token:action.token
            };

        case GET_MERCHANT:
            return{
                ...state,
                myMerchant: action.merchant,
                myDeals: action.merchant.deal,
                token:action.token
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

        default:
            return state
    };//switch
};