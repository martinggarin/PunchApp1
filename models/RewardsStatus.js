//this class is one connection between a restaurant and a customer, 
//shows how many rewwards the user has for that specific resturant
class RewardStatus {
    constructor(r_id, c_id){
        
        this.r_id = r_id;
        this.c_id = c_id;
        this.ammount = 0; //ammount of rewards
        
        //TODO: pic of receipt, array
    }

    addReward(ammount){
        this.ammount += ammount;
    }
    getAmmount(){
        return (this.ammount);
    }
    removeAmmount(ammount){
        this.ammount -= ammount;
    }

}
export default RewardStatus;