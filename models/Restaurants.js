import Deal from './Deal';

class Restaurants {
    constructor( id, title, color){
        this.username ;
        this.password;
        this.id = id;
        this.title = title;
        this.color = color; 
        this.punches = 0;
        this.deal = new Deal(10, 'Free Coffee');
       // this.picture = picture;
    }
    addPunch(){
        this.punches = this.punches +1;
       // console.log(this.redemption);
    }
    redeem(){
        if(this.punches > 10){
            this.punches = this.punches - 10;
            //this.redemption = this.redemption.concat(new Deal(0,0));
        }
        else if (this.punches === 10)
            this.punches = 0;
    }
    getDeal(){
        return (this.deal);
    }
}
export default Restaurants;