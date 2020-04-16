import RewardsStatus from './RewardsStatus'

class Customer {
    constructor(id){
        this.id = id; //unique identifier for customer
        this.RS; //array
        this.favorites; //array of restaurant ids
    }

    addFavorites(r_id){
        this.favorites = [...this.favorites, ...r_id];
        this.RS = [...this.RS, RewardStatus(this.id, r_id)];
    }

}
export default Customer;