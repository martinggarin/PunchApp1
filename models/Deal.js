class Deal {
    constructor(ammount, reward, code){
        this.ammount = ammount;
        this.reward = reward;
        this.code = code;
    }
    getAmmount(){
        return this.ammount;
    }
    getReward(){
        return this.reward;
    }
}
export default Deal;