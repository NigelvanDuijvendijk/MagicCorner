import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";
import { auth, db, getCardCollection, logout } from "../../Services/FirebaseService";
import { query, collection, getDocs, where, DocumentData } from "firebase/firestore";
import Filter from "../../Components/Filter/Filter";
function DashboardPage() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [cardCollection, setCardCollection] = useState([] as DocumentData[]);
  const [filteredCollection, setFilteredCollection] = useState([] as DocumentData[]);
  const [collectionPrice, setCollectionPrice] = useState(0);

  const navigate = useNavigate();

  const getCards = async () => {
    await getCardCollection(user).then((res) => {
      setCardCollection(res);
      var price = 0;
      res.forEach((card) => {
        price = price + parseFloat(card.price);
      });
      setCollectionPrice(price);
    });
  }

  const cardDetailsClick = (name: String) => {
      navigate("/details/" + name);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
      getCards();
  }, [user, loading]); 

  return (
    <div className="dashboard">
      <div className="container">
          <div className="filters">
            <h5>Filters</h5>
            <Filter cards={cardCollection} filterFunction={setFilteredCollection} ></Filter>
          </div>
          <div className="collection">
          <h5>Collection -  €{collectionPrice}</h5>
          <div className="row">
            {
              filteredCollection.length == 0 ?
              cardCollection && cardCollection.map(card=>{
                return <div onClick={() => cardDetailsClick(card.name)} className="card col-md-2">
                    <img src={card.image} alt={card.name} />
                    <div className="nameLabel">{card.name}</div>
                  </div>
              })
              :
              filteredCollection && filteredCollection.map(card=>{
                return <div onClick={() => cardDetailsClick(card.name)} className="card col-md-2">
                    <img src={card.image} alt={card.name} />
                    {card.name}
                  </div>
              })
            }
            </div>
          </div>
      </div>
    </div>
  );
}
export default DashboardPage;
