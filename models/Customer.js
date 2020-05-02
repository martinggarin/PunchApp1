import RewardsStatus from './RewardsStatus'

class Customer {
    constructor(id, email, password){
        this.id = id; //unique identifier for customer
        this.email = email;
        this.password = password;

        this.RS = []; //array
        this.favorites = []; //array of restaurant ids
    }
}
export default Customer;