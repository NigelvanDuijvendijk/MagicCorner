import { useState } from "react";
import { Card, Cards } from "scryfall-sdk";
import CardDetail from "../../Components/CardDetail/CardDetail";
import CardModel from "../../Models/CardModel";
import CardService from "../../Services/CardService";

function HomePage() {
    const [search, setSearch] = useState('');
    const [foundCard, setFoundCard] = useState({} as Card);
    const cardService = new CardService();
    
    const getCard = () => { 
        Cards.search(search) 
        .on("data", card => {
            setFoundCard(card); 
        })
        //add getting prints
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