import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "./InvestedPage.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, createDeck, getDecks, addInvestment, getInvestments } from "../../Services/FirebaseService";
import { DocumentData } from "firebase/firestore";
import Select from 'react-select'
import InvestmentModel from "../../Models/InvestmentModel";
import { async } from "@firebase/util";

function DecksPage() {
    const [show, setShow] = useState(false);
    const [user, loading, error] = useAuthState(auth);
    const [decks, setDecks] = useState([] as DocumentData[]);
    const [investment, setInvestment] = useState("");
    const [investmentType, setInvestmentType] = useState("");
    const [investmentPrice, setInvestmentPrice] = useState("");
    const [investments, setInvestments] = useState([] as InvestmentModel[]);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const TypeOptions = [
        { value: 'draftboosterbox', label: 'Draft booster box' },
        { value: 'setboosterbox', label: 'Set booster box' },
        { value: 'setbooster', label: 'Set booster' },
        { value: 'draftbooster', label: 'Draft booster' },
        { value: 'prereleasepack', label: 'Prerelease pack' },
        { value: 'bundle', label: 'Bundle' },
        { value: 'themebooster', label: 'Theme booster' },
        { value: 'collectorpack', label: 'Collector pack' },
        { value: 'starterpack', label: 'Starter pack' },
        { value: 'deckbuildertoolkit', label: 'Deck builders toolkit' },
        { value: 'starterpack', label: 'Starter pack' },
        { value: 'prebuilddeck', label: 'Prebuild deck' },
        { value: 'other', label: 'other' },
      ] 

      const getAllInvestments = async () => {
        setInvestments(await getInvestments(user));
      }

      const totalPayed = () => {
        let total = 0;
        investments.forEach(investment => {
          total += parseInt(investment.price.toString());
        })
        return total;
      }

    useEffect(() => {
        if (user) {
            getAllInvestments();
        }
    }, [user]);

    return (
        <div className="investmentPage">
            <main>
                <div className="container">
                    <div className="decks">
                        <div className="row">
                            <div className="col-md-12 row">
                                <div className="col-md-12">
                                    <Button className="createBtn" variant="primary" onClick={handleShow}>
                                        Add investment
                                    </Button>
                                </div> 
                                <div className="col-md-12 row stats">
                                    <div className="col-md-3 stat">
                                        <div className="stat-inner">
                                            <div className="stat-title">
                                                Total investments
                                            </div> 
                                            <div className="stat-value">
                                                {investments.length}
                                            </div>  
                                        </div>  
                                    </div>
                                    <div className="col-md-2 stat">
                                        <div className="stat-inner">
                                            <div className="stat-title">
                                                Total payed
                                            </div> 
                                            <div className="stat-value">
                                                € {totalPayed()}
                                            </div>    
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <table className="table">
                                        <tr className="tableHeader">
                                            <th>Price</th>
                                            <th>Purchase</th>
                                            <th>Type</th>
                                        </tr>
                                        {
                                            investments.map(investment => {
                                                return <tr className="tableRow">
                                                    <td>€ {investment.price}</td>
                                                    <td>{investment.name}</td>
                                                    <td>{investment.type}</td>
                                                </tr>
                                            })
                                        }
                                    </table>
                                </div>
                            </div>   
                        </div>
                    </div>
                    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Add investment</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Select onChange={event => setInvestmentType(event?.value || "")}  options={TypeOptions} />
                            <input  onChange={event => setInvestment(event.target.value)} placeholder="What did you invest in?" type="text" id="form1" className="form-control inputfield" />
                            <input  onChange={event => setInvestmentPrice(event.target.value)} className="form-control inputfield" type="number" placeholder="Price" />
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => {addInvestment(investment, investmentType, investmentPrice, user); handleClose();}}>
                            Add investment
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </main>
        </div>
    );
}
export default DecksPage; 