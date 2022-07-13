class CardFromFirebaseModel{
    image: string = "";
    name: string = "";
    oracle_id: string = "";
    price: number = 0;
    colors: string[] = [];
    mana_cost: string = "";
    oracle_text: string = "";
    realeased_at: string = "";
    set: string = "";
    set_name: string = "";
    rarity: string = ""

    constructor(cardFromFirebaseModel?: CardFromFirebaseModel) {
        Object.assign(this, cardFromFirebaseModel);
    }

    static fromJSON(json: CardFromFirebaseModelJSON): CardFromFirebaseModel{
        let card = Object.create(CardFromFirebaseModel.prototype);
        return Object.assign(card, json);
    }
}

export default CardFromFirebaseModel;


interface  CardFromFirebaseModelJSON{
    image: string,
    name: string,
    oracle_id: string,
    price: number,
    colors: string[],
    mana_cost: string,
    oracle_text: string,
    realeased_at: string,
    set: string,
    set_name: string,
    rarity: string
}