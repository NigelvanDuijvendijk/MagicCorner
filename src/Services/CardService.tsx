import { isEmpty } from "@firebase/util";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import CardFromFirebaseModel from "../Models/CardFromFirebaseModel";
import CardModel from "../Models/CardModel";
import NetworkService from "./NetworkService";
import Scry, { Cards } from"scryfall-sdk";
import MagicEmitter from "scryfall-sdk/out/util/MagicEmitter";

class CardService {

    networkService: NetworkService = new NetworkService();
    
    CardtoCardCardFromFirebaseModel(card: CardModel){
        console.log(card);
        return {
            name: card.name, 
            image: card.image_uris.large,
            oracle_id: card.oracle_id,
            price: card.prices.eur ? card.prices.eur : card.prices.eur_foil,   
            colors: card.colors,
            mana_cost: card.mana_cost,
            oracle_text: card.oracle_text,
            realeased_at: card.released_at,
            set: card.set,
            set_name: card.set_name,
            rarity: card.rarity

        };
    }

    DocumentToCardFromFirebaseModel(card: QueryDocumentSnapshot<DocumentData>){
        return {
            name: card.data().name,
            image: card.data().image,
            oracle_id: card.data().oracle_id,
            price: card.data().price,  
            colors: card.data().colors,
            mana_cost: card.data().mana_cost,
            oracle_text: card.data().oracle_text,
            realeased_at: card.data().released_at,
            set: card.data().set,
            set_name: card.data().set_name,
            rarity: card.data().rarity

        };
    }

    DocumentTypeToCardFromFirebaseModel(card: DocumentData){
        return {
            name: card.data().name,
            image: card.data().image,
            oracle_id: card.data().oracle_id,
            price: card.data().price,  
            colors: card.data().colors,
            mana_cost: card.data().mana_cost,
            oracle_text: card.data().oracle_text,
            realeased_at: card.data().released_at,
            set: card.data().set,
            set_name: card.data().set_name,
            rarity: card.data().rarity
        };
    }

    getSymbol = async (cardSymbol: string) => {
        const url = `https://api.scryfall.com/symbology`;
        var foundSymbol: string = "";
        await this.networkService.get(url).then(response => {
            response.data.forEach((result: { symbol: string; svg_uri: any; }) => {
                if (result.symbol == "{" + cardSymbol + "}")
                {   
                    return foundSymbol = result.svg_uri;
                }
            });
        });
        return foundSymbol;
    }

    getSetSymbol = async (setCode: string) => {
        const url = `https://api.scryfall.com/sets/` + setCode  ;
        var foundSymbol: string = "";
        await this.networkService.get(url).then(response => {
            foundSymbol = response.icon_svg_uri
        });
        return foundSymbol;
    }

    calculateManaValues = (cards: CardFromFirebaseModel[]) => {
        var manaValues: [{ mana: string, amount: number }] = [{mana: "Multi", amount: 0}];
        cards.forEach((card: CardFromFirebaseModel) => {
            var found: boolean = false;
            manaValues.find(element => {
                if(card.colors.length < 2){
                    if (element.mana == card.colors[0])
                    {
                        found = true;
                        element.amount++;
                    }
                }else{
                    manaValues.find(element => {
                        if(element.mana == "Multi"){
                            element.amount++;
                            found = true;
                        }
                    });
                }
            });
            if(!found){
                manaValues.push({ mana: card.colors[0], amount: 1 });
            }
        });
        var manaLines: [{title?: String, value?: number, color?: String }] = [{title: "Multi", value: 0, color: "rgba(0, 0, 0, 0.5)"}];
        manaValues.forEach(manaValue => {
            if(manaValue.mana == "Multi"){
                manaLines.push({title: "Multi", value: manaValue.amount, color: "#8634eb"});
            }else if(manaValue.mana == "W"){
                manaLines.push({title: "White", value: manaValue.amount, color: "#ffffff"});
            }else if(manaValue.mana == "U"){
                manaLines.push({title: "Blue", value: manaValue.amount, color: "#3d34eb"});
            }else if(manaValue.mana == "B"){
                manaLines.push({title: "Black", value: manaValue.amount, color: "#000000"});
            }else if(manaValue.mana == "R"){
                manaLines.push({title: "Red", value: manaValue.amount, color: "#eb4634"});
            }else if(manaValue.mana == "G"){
                manaLines.push({title: "Green", value: manaValue.amount, color: "#32a852"});
            }
        });
        return manaLines;
    }

    manaValuesToPieChart(){
        
    }

} 

export default CardService;
