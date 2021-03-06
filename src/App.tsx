import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css'; // <-- import styles to be used
import { BrowserRouter, BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from './Pages/Login/LoginPage';
import DashboardPage from './Pages/Dashboard/DashboardPage';
import ResetPage from './Pages/Reset/ResetPage';
import RegisterPage from './Pages/Register/RegisterPage';
import HomePage from './Pages/Home/HomePage';
import SearchPage from './Pages/Search/SearchPage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logout } from './Services/FirebaseService';
import DecksPage from './Pages/Decks/DecksPage';
import DeckDetailsPage from './Pages/DeckDetails/DeckDetailsPage';
import CardDetailPage from './Pages/CardDetail/CardDetailPage';
import InvestedPage from './Pages/Invested/InvestedPage';
import ScannerPage from './Pages/Scanner/ScannerPage';
import { Card, Cards } from "scryfall-sdk";

function App() {
  let navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const [automcomplete, setAutocomplete] = useState([] as string[]);

  const searchCard = () => {
    navigate("/search/" + search);
  }

  const autoComplete = async(search: string) => {
    setAutocomplete(await Cards.autoCompleteName(search));
  }

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Card Corner</a>
          <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">Home</a>
              </li>
              {
              user &&
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/dashboard">Collection</a>
              </li>
              }
              {
              user &&
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/decks">Decks</a>
              </li>
              }
              {user &&
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/invested">Invested</a>
              </li> 
              }
              {user &&
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/scanner">Scanner</a>
              </li> 
              }
            </ul>
            <div className="input-group ps-5">
              <div id="navbar-search-autocomplete" className="form-outline">
                <input onChange={event => {setSearch(event.target.value); autoComplete(event.target.value)}} type="search" id="form1" className="form-control" />
                { autoComplete.length > 0 &&
                    <ul>
                      {automcomplete.map(name => {
                        return <li onClick={() => {setSearch(name);}}>{name}</li>
                      })}
                    </ul>
                }
              </div>
              <button onClick={searchCard} type="button" className="btn btn-primary">
                search
              </button>
            </div>
            {user?.photoURL ?
              <ul className="navbar-nav">
                <li className="nav-item accountDropdown">
                  <img id="userImage" src={user?.photoURL} alt="profile" />
                  <ul className="dropdown">
                    <li>Account</li>
                    <li className="pointer" onClick={logout}>Logout</li>
                  </ul>
                </li>
              </ul>
              : null
            }
            {!user &&
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/login">Login</a>
                </li>
              </ul>
            }
          </div>
        </div>
      </nav>
        <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/reset" element={<ResetPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/decks" element={<DecksPage />} />
              <Route path="/invested" element={<InvestedPage />} />
              <Route path="/deckDetails/:deckName" element={<DeckDetailsPage />} />
              <Route path="/sharedDeck/:uuid" element={<DeckDetailsPage />} />
              <Route path="/search/:search" element={<SearchPage />} />
              <Route path="/details/:search" element={<CardDetailPage />} />
              <Route path="/scanner" element={<ScannerPage />} />

            </Routes>
        </main>
    </div>
  );
}

export default App;

