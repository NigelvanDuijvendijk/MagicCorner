import { useAuthState } from "react-firebase-hooks/auth";
import CardModel from "../../Models/CardModel";
import CardService from "../../Services/CardService";
import { auth, db, addUserToFirestore, addCardToCollection, addCardToDeck } from "../../Services/FirebaseService";
import CardSymbol from "../CardSymbol/cardSymbol";
import './CardDetail.css';
interface Props {
    card: CardModel,
    deck?: string
}

function CardDetail({card, deck}: Props) {
    const [user] = useAuthState(auth);
    const cardService: CardService = new CardService();
    const addToCollection = () => {
        addUserToFirestore(user).then(() => {        
            addCardToCollection(card, user);
        });
    }

    const addPrintToCollection = (print: CardModel) => {
        addUserToFirestore(user).then(() => {        
            addCardToCollection(print, user);
        });
    }

    const addToDeck = (card: CardModel) => {
        addCardToDeck(card, user, deck!);
    }

    const add = () => {
        if(!deck){
            addToCollection();
        }else{
            addToDeck(card)
        }
    }

    return (
        <div className="cardDetail">
            <div className="header">
                <h5>{card.name}</h5>
                <span className="mana">   
                        {
                            card.colors.map((color: string) => {
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
                <img className="cardImage" src={card.image_uris.large} alt={card.name} />
                <button className="btn btn-primary" onClick={add}>+</button>
            </div>   
                <div className="content-left col-md-4">
                    <div className="oracleText">
                        <p>{card.oracle_text}</p>
                    </div>
                </div>
                <div className="content-right col-md-5">
                    <div className="row">
                            { card.prints != undefined &&
                                <div className="prints">
                                    <div className="searchHeader"><p>Prints</p></div>
                                    <ul>
                                        {card.prints.map(print => {         
                                             return <li>
                                                        <div className="row">
                                                            <a className="col-md-8">{print.set_name} #{print.collector_number} €{print.prices.eur ? print.prices.eur : print.prices.eur_foil}</a>
                                                            <img className="printImage" src={print.image_uris.large}></img>
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

