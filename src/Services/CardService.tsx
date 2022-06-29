import NetworkService from "./NetworkService";

class CardService {

    networkService: NetworkService = new NetworkService();

    async searchCard(search: string){
        const url = `https://api.scryfall.com/cards/search?q=${search}`;
        return this.networkService.get(url);
    }

    async searchPrints(search: string){
        const url = `https://api.scryfall.com/cards/search?q=${search}&unique=prints`;
        return this.networkService.get(url);
    }

}

export default CardService;
