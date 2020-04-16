import RewardsStatus from './RewardsStatus'

class Customer {
    constructor(id){
        this.id = id; //unique identifier for customer
        this.RewardsStatus; //array
        this.favorites; //array of restaurant ids
    }

    addFavorites(r_id){
        this.favorites = [...this.favorites, ...r_id];
    }

}
export default Customer;