import { useAuthState } from "react-firebase-hooks/auth";
import CardModel from "../../Models/CardModel";
import { auth, db, addUserToFirestore, addCardToCollection } from "../../Services/FirebaseService";
import './CardDetail.css';
interface Props {
    card: CardModel,
}

function CardDetail({card}: Props) {
    const [user, loading, error] = useAuthState(auth);

    const addToCollection = () => {
        addUserToFirestore(user).then(() => {        
            addCardToCollection(card, user);
        });
    }

    return (
        <div className="cardDetail">
            <h5>{card.name} <span className="circle">{card.collector_number}</span></h5>
            <img src={card.image_uris.normal} alt={card.name} />
            <button className="btn btn-primary"onClick={addToCollection}>+</button>
            <div className="row content">
                <div className="content-top col-md-12 row">
                    <div className="col-9">
                        <p>Set</p>
                        <p>{card.set_name}</p>
                    </div>
                </div>
                <div className="content-left col-md-6">
                    <div className="row">
                        <div className="col-md-6">
                        </div>
                    </div>
                </div>
                <div className="content-right col-md-6">
                    <div className="row">
                        <div className="col-md-6">
                            { card.prints != undefined &&
                                <div>
                                    <p>Prints</p>
                                    <ul>
                                        {card.prints.map(print => {
                                            return <li>{print.name}</li>
                                        })
                                        }
                                    </ul>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default CardDetail;

