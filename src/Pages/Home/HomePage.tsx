import { useState } from "react";
import CardDetail from "../../Components/CardDetail/CardDetail";
import CardModel from "../../Models/CardModel";
import CardService from "../../Services/CardService";

function HomePage() {
    const [search, setSearch] = useState('');
    const [foundCard, setFoundCard] = useState({} as CardModel);
    const cardService = new CardService();
    
    const getCard = () => { 
        cardService.searchCard(search).then((newCard) => {
        const card: CardModel = CardModel.fromJSON(newCard.data[0]);
        setFoundCard(card); 
        }).catch((error) => {
        console.log(error);
        });
    }

    return (
        <div className="HomePage">
            <div className="container">
                { 
                    foundCard.name != null ?
                    <CardDetail card={foundCard} />
                    : null
                }
            </div>
        </div>
    );
}
export default HomePage;