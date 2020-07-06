class Merchant {
    constructor(id, email){
        this.id = id
        this.email = email;
        this.title = '';
        this.price = ''
        this.type = '';
        this.address = '';
        this.city = ''
        this.deal = [];
        this.customers = []
        this.transactions = []
    }
}
export default Merchant;