import Deal from './Deal';

class Restaurants {
    constructor( id, email, password, title){
        this.email = email;
        this.password = password;
        this.id = id;
        this.title = title;
        this.price = '$$$';
        this.type = 'American, Bar';
        this.address = '123 imaginary st';
        this.city = 'Fake City, State'

        this.deal = [
            new Deal(10.0, 'Free Coffee', 'code1'),
            new Deal(15.0, 'Free Cake', 'code2'),
            new Deal(20, 'Free IceCream', 'code3')
        ];
        this.customers = []
    }
}
export default Restaurants;