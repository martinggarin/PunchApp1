import {
    CREATE_MERCHANT,
    GET_MERCHANT, 
    LOGOUT_MERCHANT, 
    UPDATE_MERCHANT,
    UPDATE_DEALS,
    LOAD_ALL_MERCHANTS} from '../actions/merchants';
import Merchant from '../../models/Merchant';

const initialState = {
    availableMerchants: [], 
    myMerchant: {}, 
    myDeals: []
};

// most problems have been due to my inability to spell retaurant
export default (state = initialState, action) => {
    switch(action.type){

        case CREATE_MERCHANT:
            const newMerchant = new Merchant(action.merchantData.id, action.merchantData.email);
            return {
                ...state,
                myMerchant: newMerchant, 
                myDeals: newMerchant.deal,
                availableMerchants: state.availableMerchants.concat(newMerchant),
            };

        case GET_MERCHANT:
            return{
                ...state,
                myMerchant: action.merchant,
                myDeals: action.merchant.deal,
            };

        case LOGOUT_MERCHANT:
            return initialState

        case UPDATE_MERCHANT:
            return {
                ...state,
                myMerchant: action.merchantData,
                myDeals: action.merchantData.deal
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