import ImageUrisModel from "./ImageUrisModel";
import PricesModel from "./PricesModel";
class CardModel{

    artist: string = "";
    border_color: string = "";
    cardmarket_id: string = "";
    collector_number: string = "";
    colors: string[] = [];
    finishes: string[] = [];
    foil: boolean = false;
    full_art: boolean = false;
    image_uris: ImageUrisModel = {
        small: "",
        normal: "",
        large: "",
        png: "",
        art_crop: "",
        border_crop: ""
    };
    lang: string = "";
    name: string = "";
    mana_cost: string = "";
    nonfoil: boolean = false;
    oracle_id: string = "";
    oracle_text: string = "";
    prices: PricesModel = {
        eur: "",
        eur_foil: "",
        tix: "",
        usd: "",
        usd_etched: "",
        usd_foil: ""
    };
    promo: boolean = false;
    purchase_uris: {} = {};
    released_at: string = "";
    reprint: boolean = false;
    rulings_uri: string = "";
    set: string = "";
    set_name: string = "";
    set_type: string = "";
    type_line: string = "";
    prints: CardModel[] = [];
    rarity: string = "";
    constructor(cardModel?: CardModel) {
        Object.assign(this, cardModel);
    }

    static fromJSON(json: CardJSON): CardModel{
        let card = Object.create(CardModel.prototype);
        return Object.assign(card, json);
    }
}

export default CardModel

interface CardJSON{
    artist: string,
    border_color: string,
    cardmarket_id: string,
    collector_number: string,
    colors: string[],
    finishes: string[],
    foil: boolean,
    full_art: boolean,
    image_uris: {},
    lang: string,
    name: string,
    mana_cost: string,
    nonfoil: boolean,
    oracle_id: string,
    oracle_text: string,
    prices: {},
    promo: boolean,
    purchase_uris: {},
    realeased_at: string, 
    reprint: boolean,
    rulings_uri: string,
    set: string,
    set_name: string,
    set_type: string,
    type_line: string,
    prints : CardModel[],
    rarity: string
}