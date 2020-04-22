import Deal from './Deal';

class Restaurants {
    constructor( id, title, color){
        this.username ;
        this.password;
        this.id = id;
        this.title = title;
        this.color = color; 
        this.punches = 1; //this will come from the user model
        this.deal = [
            new Deal(10.0, 'Free Coffee'),
            new Deal(15.0, 'Free Cake'),
            new Deal(20, 'Free IceCream')];    
    }
    addPunch(){
        this.punches += 1;
       // console.log(this.redemption);
    }
    redeem(){
        if(this.punches >= 10){
            this.punches = this.punches - 10;
            return true;
            //this.redemption = this.redemption.concat(new Deal(0,0));
        }
        return false;
       
    }
    getDeal(){
        return (this.deal);
    }
}
export default Restaurants;