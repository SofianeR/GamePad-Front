import "./App.scss";
import { useState } from "react";

// import pages
import Home from "./pages/Home";
import SingleGame from "./pages/SingleGame/SingleGame";
import Favoris from "./pages/Favoris/Favoris";

// import components
import Header from "./components/Header";
import Footer from "./components/Footer/Footer";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faMagnifyingGlass,
  faUser,
  faBookmark,
  faMessage,
  faCircleXmark,
  faChevronCircleLeft,
  faChevronCircleRight,
  faFilter,
  faChevronCircleUp,
  faChevronCircleDown,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faMagnifyingGlass,
  faUser,
  faBookmark,
  faMessage,
  faCircleXmark,
  faChevronCircleLeft,
  faChevronCircleRight,
  faFilter,
  faChevronCircleUp,
  faChevronCircleDown,
  faThumbsDown,
  faThumbsUp
);

function App() {
  const [modalLogin, setModalLogin] = useState(false);

  const [token, setToken] = useState(Cookies.get("token") || null);
  const [favoris, setFavoris] = useState(
    Cookies.get("favors") ? Cookies.get("favoris") : []
  );

  const connexion = (token, favoris) => {
    if (token) {
      setToken(token);
      Cookies.set("token", token);

      setFavoris(favoris);
      const stringifiedFavoris = JSON.stringify(favoris);

      Cookies.set("favoris", stringifiedFavoris);

      console.log("connecté");
    } else {
      setToken(null);
      Cookies.remove("token");

      setFavoris([]);
      Cookies.remove("favoris");
      console.log("déconnecté");
    }
  };

  return (
    <div className="App">
      <Router>
        <Header
          modalLogin={modalLogin}
          setModalLogin={setModalLogin}
          connexion={connexion}
          token={token}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Home modalLogin={modalLogin} setModalLogin={setModalLogin} />
            }></Route>

          <Route
            path="/game/:id"
            element={
              <SingleGame
                modalLogin={modalLogin}
                setModalLogin={setModalLogin}
                token={token}
                favoris={favoris}
                setFavoris={setFavoris}
              />
            }></Route>

          <Route
            path="/favoris"
            element={
              <Favoris
                modalLogin={modalLogin}
                setModalLogin={setModalLogin}
                token={token}
                favoris={favoris}
                setFavoris={setFavoris}
              />
            }></Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
