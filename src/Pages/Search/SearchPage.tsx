import { useEffect, useState } from "react";
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, Cards } from "scryfall-sdk";
import CardDetail from "../../Components/CardDetail/CardDetail";
import CardModel from "../../Models/CardModel";
import CardService from "../../Services/CardService";

function SearchPage() {
    const { search } = useParams();
    const [foundCard, setFoundCard] = useState([] as Card[]);
    const cardService = new CardService();

    useEffect(() => {
        setFoundCard([]);
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
    if(foundCard.length > 0){
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
    }else{
        return (
            <div className="HomePage">
                <div className="container"> 
                   <h4>No card found</h4>
                </div>
            </div>
        );
    }
}

export default SearchPage;