class Restaurants {
    constructor(id, title, color){
        
        this.id = id;
        this.title = title;
        this.color = color; 
        this.punches = 0;
       // this.picture = picture;
    }
    addPunch(){
        this.punches = this.punches +1;
    }
    redeem(){
        if(this.punches > 10){
            this.punches = this.punches - 10;
        }
        else if (this.punches === 10)
            this.punches =0;
    }
}
export default Restaurants;