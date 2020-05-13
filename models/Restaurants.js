import Deal from './Deal';

class Restaurants {
    constructor( id, email, password){
        this.email = email;
        this.password = password;
        this.id = id;
        this.title = '';
        this.price = ''
        this.type = '';
        this.address = '';
        this.city = ''
        this.deal = [];
        this.customers = []
    }
}
export default Restaurants;