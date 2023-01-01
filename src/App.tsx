import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css"; // <-- import styles to be used
import {
  BrowserRouter,
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./Pages/Login/LoginPage";
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import ResetPage from "./Pages/Reset/ResetPage";
import RegisterPage from "./Pages/Register/RegisterPage";
import HomePage from "./Pages/Home/HomePage";
import SearchPage from "./Pages/Search/SearchPage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "./Services/FirebaseService";
import CardDetailPage from "./Pages/CardDetail/CardDetailPage";
import InvestedPage from "./Pages/Invested/InvestedPage";
import { Cards } from "scryfall-sdk";
import CsvExportPage from "./Pages/CsvExport/CsvExportPage";
function App() {
  let navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [automcomplete, setAutocomplete] = useState([] as string[]);

  const searchCard = () => {
    navigate("/search/" + search);
  };

  const autoComplete = async (search: string) => {
    setAutocomplete(await Cards.autoCompleteName(search));
  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand-sm navbar-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Card Corner
          </a>

          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">
                Home
              </a>
            </li>
            {user && (
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/dashboard"
                >
                  Collection
                </a>
              </li>
            )}
            {user && (
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/invested"
                >
                  Invested
                </a>
              </li>
            )}
            <li className="nav-item">
              <a
                className="nav-link active"
                aria-current="page"
                href="/Convert"
              >
                Convert
              </a>
            </li>
          </ul>
          <div className="input-group ps-5">
            <div id="navbar-search-autocomplete" className="form-outline">
              <input
                onChange={(event) => {
                  setSearch(event.target.value);
                  autoComplete(event.target.value);
                }}
                type="search"
                id="form1"
                className="form-control"
              />
              {/* { autoComplete.length > 0 &&
                    <ul>
                      {automcomplete.map(name => {
                        return <li onClick={() => {setSearch(name);}}>{name}</li>
                      })}
                    </ul>
                } */}
            </div>
            <button
              onClick={searchCard}
              type="button"
              className="btn btn-primary searchButton"
            >
              search
            </button>
          </div>
          {user?.photoURL ? (
            <ul className="navbar-nav">
              <li className="nav-item accountDropdown">
                <img id="userImage" src={user?.photoURL} alt="profile" />
                <ul className="dropdown">
                  <li>Account</li>
                  <li className="pointer" onClick={logout}>
                    Logout
                  </li>
                </ul>
              </li>
            </ul>
          ) : null}
          {!user && (
            <ul className="navbar-nav">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/login"
                >
                  Login
                </a>
              </li>
            </ul>
          )}
        </div>
        {/* <button className="navbar-toggler" type="button">
          <span className="navbar-toggler-icon"></span>
        </button> */}
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/reset" element={<ResetPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/invested" element={<InvestedPage />} />
          <Route path="/search/:search" element={<SearchPage />} />
          <Route path="/details/:search" element={<CardDetailPage />} />
          <Route path="/Convert" element={<CsvExportPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
