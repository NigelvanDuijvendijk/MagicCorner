import CardFromFirebaseModel from "./CardFromFirebaseModel";

class InvestmentModel {
    name: string = "";
    type: string = ""
    price: String = "";

    constructor(name: string, type: string, price: String){
        Object.assign(this, {name, type, price});
    }
}
export default InvestmentModel;
