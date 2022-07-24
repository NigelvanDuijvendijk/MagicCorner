import { useAuthState } from "react-firebase-hooks/auth";
import CardModel from "../../Models/CardModel";
import CardService from "../../Services/CardService";
import { auth, db, addUserToFirestore, addCardToCollection, addCardToDeck } from "../../Services/FirebaseService";
import CardSymbol from "../CardSymbol/cardSymbol";
import Scry, { Cards, Card } from"scryfall-sdk";
import './CardDetail.css';
import { useState } from "react";
interface Props {
    card: Card,
    deck?: string
}


function CardDetail({card, deck}: Props) {
    const [prints, setPrints] = useState([] as Card[]);
    const [user] = useAuthState(auth);
    const cardService: CardService = new CardService();
    const addToCollection = () => {
        addUserToFirestore(user).then(() => {        
            addCardToCollection(card, user);
        });
    }

    const addPrintToCollection = (print: Card) => {
        addUserToFirestore(user).then(() => {        
            addCardToCollection(print, user);
        });
    }

    const addToDeck = (card: Card) => {
        addCardToDeck(card, user, deck!);
    }

    const add = () => {
        if(!deck){
            addToCollection();
        }else{
            addToDeck(card)
        }
    }

    const getPrints = async () => {
        await card.getPrints().then(newPrints => {
            setPrints(newPrints); 
        });
    }

    getPrints();

    return ( 
        <div className="cardDetail">
            <div className="header">
                <h5>{card.name}</h5>
                <span className="mana">   
                        {
                            card.colors?.map((color: string) => {
                                return <CardSymbol symbol={color}></CardSymbol>
                            })
                        }
                    </span>
            </div>
            {/* <div className="col-md-2">
                    <span className="circle">{card.collector_number}</span>
                </div> */}
            <div className="row gl0">
            <div className="col-md-3 col-sm-12">
                <img className="cardImage" src={card.image_uris?.large} alt={card.name} />
                <button className="btn btn-primary" onClick={add}>+</button>
            </div>   
                <div className="content-left col-md-4">
                    <div className="oracleText">
                        <p>{card.oracle_text}</p>
                    </div>
                </div>
                <div className="content-right col-md-5">
                    <div className="row">
                            { 
                                <div className="prints">
                                    <div className="searchHeader"><p>Prints</p></div>
                                    <ul>
                                        {prints.map(print => {         
                                        return <li>
                                                <div className="row">
                                                    <a className="col-md-8">{print.set_name} #{print.collector_number} €{print.prices.eur ? print.prices.eur : print.prices.eur_foil}</a>
                                                    <img className="printImage" src={print.image_uris!.large}></img>
                                                    <span className="col-md-2 printSymbol"><CardSymbol set={true} symbol={print.set}></CardSymbol></span>
                                                    <button className="printButton col-md-1" onClick={() => addPrintToCollection(print)}>+</button>
                                                </div>
                                            </li>
                                        }) 
                                        }
                                    </ul>
                                </div>
                            }
                    </div>
                </div>
            </div>    
        </div>
    );
}

export default CardDetail;

