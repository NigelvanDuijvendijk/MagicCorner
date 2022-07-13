class PricesModel{
    eur: string = "";
    eur_foil: string = "";
    tix: string = "";
    usd: string = "";
    usd_etched: string = "";
    usd_foil: string = "";

    constructor(imageUrisModel?: PricesModel) {
        Object.assign(this, imageUrisModel);
    }

    static fromJSON(json: PricesModel): PricesModel{
        let uris = Object.create(PricesModel.prototype);
        return Object.assign(uris, json);
    }
}

export default PricesModel;


interface  PricesModel{
    eur: string,
    eur_foil: string,
    tix: string,
    usd: string,
    usd_etched: string,
    usd_foil: string,
}