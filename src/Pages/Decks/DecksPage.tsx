import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "./DecksPage.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, createDeck, getDecks } from "../../Services/FirebaseService";
import { DocumentData } from "firebase/firestore";
import CardService from "../../Services/CardService";
import CardFromFirebaseModel from "../../Models/CardFromFirebaseModel";

function DecksPage() {
    const [show, setShow] = useState(false);
    const [newDeckname, setNewDeckname] = useState('');
    const [user, loading, error] = useAuthState(auth);
    const [decks, setDecks] = useState([] as DocumentData[]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const cardService: CardService = new CardService();
    const createNewDeck = () => {
        createDeck(newDeckname, user);
        handleClose();
        getAllDecks();
    }

    const getAllDecks = () => {
        getDecks(user).then(res => {
            setDecks(res);
        });
    }

    const deckDetails = (deck: string) => {
        window.location.href = 'DeckDetails/' + deck;
      }

    useEffect(() => {
        getAllDecks();
    }, [user])

    return (
        <div className="DecksPage">
            <main>
                <div className="container">
                    <div className="filters">
                        <h5>Filters</h5>
                    </div>
                    <div className="decks">
                        <div className="row">
                            <div className="col-12">
                                <Button className="createBtn" variant="primary" onClick={handleShow}>
                                    Create Deck
                                </Button> 
                            </div>   
                            <div className="deckRow col-12">
                                <div className="row g-2">
                                    {
                                        decks.map(deck => {
                                            return <div className="deck col-md-3 col-sm-12" onClick={() =>deckDetails(deck.name)}>
                                                    <div className="deckInner">
                                                        <h5>{deck.name}</h5>
                                                    </div>
                                                </div>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Create deck</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input onChange={event => setNewDeckname(event.target.value)} placeholder="Deck name" type="text" id="form1" className="form-control" />
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={createNewDeck}>
                            Create Deck
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </main>
        </div>
    );
}
export default DecksPage; 