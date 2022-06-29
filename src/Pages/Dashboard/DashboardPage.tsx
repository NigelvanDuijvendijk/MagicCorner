import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";
import { auth, db, getCardCollection, logout } from "../../Services/FirebaseService";
import { query, collection, getDocs, where, DocumentData } from "firebase/firestore";
function DashboardPage() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [cardCollection, setCardCollection] = useState([] as DocumentData[]);

  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
    } 
  };

  const getCards = async () => {
    setCardCollection(await getCardCollection(user));
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    getCards();
  }, [user, loading]);
  return (
    <div className="dashboard">
      <div className="container">
          <div className="filters">
            <h5>Filters</h5>
          </div>
          <div className="collection">
          <h5>Collection</h5>
          <div className="row">
            {
              cardCollection && cardCollection.map(card=>{
                return <div className="card col-md-2">
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
