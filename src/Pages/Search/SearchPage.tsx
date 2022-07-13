import { useEffect, useState } from "react";
import { useParams, useSearchParams } from 'react-router-dom';
import CardDetail from "../../Components/CardDetail/CardDetail";
import CardModel from "../../Models/CardModel";
import CardService from "../../Services/CardService";

function SearchPage() {
    const { search } = useParams();
    const [foundCard, setFoundCard] = useState([] as CardModel[]);
    const cardService = new CardService();

    useEffect(() => {
        setFoundCard([]);
        if(search != null) {
            getCard(search);
        }
    }, [search]);
    
    const getCard = (search: string) => {
        cardService.searchCard(search).then((foundCards) => {
            foundCards.data.forEach((card: any) => {
                var newCard: CardModel = CardModel.fromJSON(card);
                newCard.prints = [];
                cardService.searchPrints(card.name).then((foundPrints) => {
                    foundPrints.data.forEach((print: CardModel) => {
                        const newPrint: CardModel = print;
                            newCard.prints.push(newPrint);
                    });
                });
                setFoundCard(foundCard => [...foundCard, newCard]); 
            });
        }).catch((error) => { 
            console.log(error);
        });
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

export default SearchPage;