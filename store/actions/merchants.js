export const ADD_RESTAURANT = 'ADD_RESTAURANT';
export const REMOVE_RESTAURANT = 'REMOVE_RESTAURANT';
export const TOGGLE_FAV = 'ADD_RESTAURANT';
export const UPDATE_RESTAURANT = 'UPDATE_RESTAURANT';

export const toggleFav = (id) => {
    return {type: TOGGLE_FAV, restaurant_id: id};
};

export const removeRestaurant = (id) => {
    return {type: REMOVE_RESTAURANT, restaurant_id: id}
};

// export const addRestaurant = () =>{
//     return {}
// }

// export const updateRestaurant = () =>{
//     return {}
// }