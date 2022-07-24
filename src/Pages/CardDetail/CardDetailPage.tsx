import { useEffect, useState } from "react";
import { useParams, useSearchParams } from 'react-router-dom';
import CardDetail from "../../Components/CardDetail/CardDetail";
import CardModel from "../../Models/CardModel";
import CardService from "../../Services/CardService";
import Scry, { Cards, Card } from"scryfall-sdk";

function CardDetailPage() {
    const { search } = useParams();
    const [foundCard, setFoundCard] = useState([] as Card[]);
    const cardService = new CardService();

    useEffect(() => {
        if(search != null) {
            getCard(search);
        }
    }, [search]);
      
    const getCard = async (search: string) => {
        Cards.search(search) 
        .on("data", card => {
            setFoundCard(foundCard => [...foundCard, card]); 
        })
    }

        return (
            <div className="HomePage">
                <div className="container"> 
                    <div className="row">
                        { foundCard != null ? 
                            foundCard.map(card => {
                                return <div className="cards col-md-12"> <CardDetail card={card}/> </div>
                            })
                            : <h2>Loading</h2>    
                        }
                    </div>
                </div>
            </div>
        );
}

export default CardDetailPage;