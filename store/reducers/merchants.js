import {DUMMY} from '../../data/Dummy-Data';
import {TOGGLE_FAV, 
        REMOVE_RESTAURANT, 
        ADD_RESTAURANT, 
        UPDATE_RESTAURANT} from '../actions/merchants';
import Restaurants from '../../models/Restaurants';

const initialState = {

    availableRestaurants: DUMMY, 
    userRestaurants: []

};
//most problems have been due to my inability to spell retaurant
export default (state = initialState, action) => {

    switch(action.type){
        case TOGGLE_FAV:
            const existingIndex = state.userRestaurants.findIndex(r => r.id === action.restaurant_id);
            if(existingIndex >= 0){
                const updatedRestaurants = [...state.userRestaurants];
                updatedRestaurants.splice(existingIndex, 1);
                return{...state, userRestaurants: updatedRestaurants};
            }else{
                return{...state, userRestaurants: state.userRestaurants.concat(state.availableRestaurants.find(r=>r.id===action.restaurant_id))};
            }
    };//switch

    return state;
}