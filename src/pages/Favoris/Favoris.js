import React from "react";

import GamesListComponent from "../../components/GamesListComponent";

const Favoris = ({ favoris, setFavoris, token, modaLogin, setModalLogin }) => {
  return (
    <div className="favoris-container">
      <h1>Mes favoris</h1>
      {!token ? (
        <div className="disconnected-container">
          <h3>Connectez vous pour consulter et modifier vos favoris !</h3>
        </div>
      ) : token && favoris.length < 1 ? (
        <div className="disconnected-container">
          <h3>Commencez a ajouter des favoris pour les voir apparaitre ici</h3>
        </div>
      ) : (
        token &&
        favoris && (
          <div className="list-favoris">
            <GamesListComponent
              gamesData={favoris}
              isFavoris={true}
              setFavoris={setFavoris}
              token={token}
            />
          </div>
        )
      )}
    </div>
  );
};

export default Favoris;
