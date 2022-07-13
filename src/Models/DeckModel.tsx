import CardFromFirebaseModel from "./CardFromFirebaseModel";

class DeckModel{
    name: string = "";
    id: string = ""
    cards: CardFromFirebaseModel[] = [];

    constructor(deckModel?: DeckModel) {
        Object.assign(this, deckModel);
    }

    static fromJSON(json: DeckModelJSON): DeckModel{
        let uris = Object.create(DeckModel.prototype);
        return Object.assign(uris, json);
    }
}

export default DeckModel;


interface  DeckModelJSON{
    name: string,
    cards: CardFromFirebaseModel[],
    id: string
}