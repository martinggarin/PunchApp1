import RewardsStatus from './RewardsStatus'

class Customer {
    constructor(id, email){
        this.id = id; //unique identifier for customer
        this.email = email;
        this.RS = []; //array
        this.favorites = []; //array of merchant ids
    }
}
export default Customer;