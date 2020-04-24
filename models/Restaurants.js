import Deal from './Deal';

class Restaurants {
    constructor( id, email, password, title){

        this.email = email;
        this.password = password;
        this.id = id;
        this.title = title;

        this.deal = [
            new Deal(10.0, 'Free Coffee', 'code1'),
            new Deal(15.0, 'Free Cake', 'code2'),
            new Deal(20, 'Free IceCream', 'code3')];    
    }
}
export default Restaurants;