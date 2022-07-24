import { useEffect, useState } from "react";
import "./DeckDetailsPage.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, createDeck, getCardCollection, getDeck, getSharedDeck, getShareUrl } from "../../Services/FirebaseService";
import { useNavigate, useParams } from "react-router-dom";
import { DocumentData } from "firebase/firestore";
import { Button, Modal } from "react-bootstrap";
import CardDetail from "../../Components/CardDetail/CardDetail";
import CardService from "../../Services/CardService";
import CardModel from "../../Models/CardModel";
import DeckModel from "../../Models/DeckModel";
import { PieChart } from "react-minimal-pie-chart";
import Filter from "../../Components/Filter/Filter";
import { faCoffee, faShare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Cards } from "scryfall-sdk";

function DecksPage() {
    const [user] = useAuthState(auth);
    const [show, setShow] = useState(false);

    const {deckName} = useParams();
    const {uuid} = useParams();
    const [deck, setDeck] = useState({} as DeckModel);
    const [pieManaChart, setManaPieChart] = useState([] as any[]);
    const [search, setSearch] = useState('');
    const [shareUrl, setShareUrl] = useState('');
    const [foundCard, setFoundCard] = useState([] as Card[]);
    const cardService = new CardService();
    const navigate = useNavigate();
    const [filteredCollection, setFilteredCollection] = useState([] as DocumentData[]);
    const [cardCollection, setCardCollection] = useState([] as DocumentData[]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getCurrentDeck = async () => {
        if(user && !uuid){
            getDeck(user, deckName!).then(res => {
                setDeck(res);
                setManaPieChart(cardService.calculateManaValues(res.cards));
            });
        }else if(uuid){
            getSharedDeck(uuid).then(res => {
                setDeck(res);
                setManaPieChart(cardService.calculateManaValues(res.cards));
            });
        }
    } 

    const getCard = async (search: string) => {
        Cards.search(search) 
        .on("data", card => {
            setFoundCard(foundCard => [...foundCard, card]); 
        })
    } 

    const getCardsCollection = async () => {
        await getCardCollection(user).then((res) => {
            setCardCollection(res);
            var price = 0;
            res.forEach((card) => {
            price = price + parseFloat(card.price);
            });
        });
    }
      
    const cardDetailsClick = (name: String) => {
        navigate("/details/" + name);
    }

    const cardInCollection = (name: String) => {
        return cardCollection.find(card => card.name === name);
    }

    useEffect(() => {
    if(user)
        getCurrentDeck();
        getCardsCollection();
    }, [user])   

        return (
            <div className="DecksPage">
                <main>
                    <div className="container">
                        <div className="filters"> 
                            <h5>Filters</h5>      
                            <Filter cards={deck.cards} filterFunction={setFilteredCollection} ></Filter>  
                        </div>
                        <div className="decks">
                            <h3 className="pt-2 name">{deck.name}<button onClick={() => {navigator.clipboard.writeText("http://localhost:3000/sharedDeck/" + deck.id)}} className="btn btn-primary shareBtn"><FontAwesomeIcon icon={faShare} /></button></h3>
                            <div className="row">
                                <div className="row col-md-12 pb-5 pt-5 g-0">
                                    <div className="col-md-12 row stats">
                                        <div className="col-md-2">
                                            <PieChart 
                                            rounded={true}
                                            lineWidth={20}
                                            label={({ dataEntry }) => dataEntry.value > 0 ? dataEntry.value : ""}
                                            labelStyle={(index) => ({
                                                fontSize: '8px'
                                            })}
                                            radius={42}
                                            labelPosition={112}
                                            data={pieManaChart}
                                            />
                                        </div>
                                    </div> 
                                    <div className="input-group col-md-12 pt-5">
                                        <div id="navbar-search-autocomplete" className="form-outline">
                                            <input onChange={event => setSearch(event.target.value)} type="search" id="form1" className="form-control" />
                                        </div>
                        
                                        <Button className="btn btn-primary" variant="primary" onClick={() => {getCard(search); handleShow();}}>
                                                Search 
                                        </Button> 
                                    </div> 
                                </div> 
                                {   
                                    filteredCollection.length < 1 ?
                                    deck.cards && deck.cards.map(card=>{
                                        return <div onClick={() => cardDetailsClick(card.name)} className="card col-md-2">
                                        {
                                            cardInCollection(card.name) && <div className="cardInCollection">✔</div>
                                        }
                                        <img src={card.image} alt={card.name} />
                                        {card.name}
                                        </div>
                                    }) 
                                    : 
                                    filteredCollection.map(card=>{
                                        return <div onClick={() => cardDetailsClick(card.name)} className="card col-md-2">
                                        <img src={card.image} alt={card.name} />
                                        <div className="nameLabel">{card.name}</div> 
                                        </div>
                                    }) 
                                }
                            </div>
                        </div>
                        
                    </div>
                    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                            <Modal.Title>Card search</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <div className="row">
                                { foundCard != null ? 
                                    foundCard.map(card => {
                                        return <div className="cards col-md-12"> <CardDetail deck={deck.name} card={card}/> </div>
                                    })
                                    : <h2>Loading</h2> 
                                }
                            </div>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="primary" onClick={() => {handleClose(); getCurrentDeck()}}>
                                Close
                            </Button>
                            </Modal.Footer> 
                        </Modal>
                </main>
            </div>
        );
    }
export default DecksPage; 