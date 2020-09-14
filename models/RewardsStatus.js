// this class is one connection between a restaurant and a customer,
// shows how many rewwards the user has for that specific resturant
class RewardStatus {
  constructor(merchantID, amount = 0) {
    this.merchantID = merchantID;
    // this.c_id = c_id;
    this.amount = amount; // amount of rewards

    // TODO: pic of receipt, array
  }
}
export default RewardStatus;
